import autobind from "autobind-decorator";
import {
    defaultSortMethod,
    formatPercentValue,
    isGermlineMutation,
    isPathogenicMutation,
    isSomaticMutation,
    Mutation,
    numberOfLeadingDecimalZeros,
    SignalMutationStatus
} from 'cbioportal-utils';
import {computed, makeObservable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import {
    Annotation,
    CancerTypeFilter,
    ColumnSortDirection,
    DataFilter,
    DataFilterType,
    MUTATION_COLUMNS_DEFINITION,
    MutationColumn,
    ProteinChange,
    TrackName
} from "react-mutation-mapper";

import { renderNumber } from "cbioportal-frontend-commons";
import {IExtendedSignalMutation, ISignalTumorTypeDecomposition} from "cbioportal-utils";
import {IEnsemblGene} from "../model/EnsemblGene";
import {
    applyCancerTypeFilter,
    applyMutationStatusFilter,
    CANCER_TYPE_FILTER_ID,
    CANCER_TYPE_IGNORE_MUTATION_STATUS_FILTER_TYPE,
    containsCancerType,
    getDefaultMutationStatusFilterValues,
    isKnownTumorType,
    MUTATION_COUNT_FILTER_TYPE,
    MUTATION_STATUS_FILTER_ID,
    MUTATION_STATUS_FILTER_TYPE,
    MutationCountFilter,
    MutationStatusFilter,
} from "../util/FilterUtils";
import {
    calculateMutationRate,
    getVariantCount,
} from "../util/MutationDataUtils";
import {loaderWithText} from "../util/StatusHelper";
import {ColumnId, HEADER_COMPONENT} from "./ColumnHeaderHelper";
import {renderCancerType, renderHgvsg, renderMutationStatus, renderPenetrance, renderPercentage} from "./ColumnRenderHelper";
import {sortPenetrance} from "./GeneFrequencyTable";
import MutationTumorTypeFrequencyDecomposition from "./MutationTumorTypeFrequencyDecomposition";
import SignalMutationMapper from "./SignalMutationMapper";

// TODO make these externally configurable?
const API_CACHE_LIMIT = 450;
const ISOFORM_OVERRIDE_SOURCE = "mskcc";
const ONCOKB_API_URL = "https://www.cbioportal.org/proxy/oncokb";

interface IMutationMapperProps
{
    data: IExtendedSignalMutation[];
    hugoSymbol: string;
    cancerTypes?: string[];
    mutationStatuses?: string[];
    ensemblGene?: IEnsemblGene;
}

function mutationStatusAccessor(mutation: IExtendedSignalMutation)
{
    if (isSomaticMutation(mutation)) {
        return SignalMutationStatus.SOMATIC;
    }
    else if (isGermlineMutation(mutation)) {
        if (isPathogenicMutation(mutation)) {
            return SignalMutationStatus.PATHOGENIC_GERMLINE;
        }
        else {
            return SignalMutationStatus.BENIGN_GERMLINE;
        }
    }

    return "Unknown";
}

function mutationPercentAccessor(mutation: IExtendedSignalMutation)
{
    if (isSomaticMutation(mutation)) {
        return mutation.somaticFrequency;
    }
    else if (isGermlineMutation(mutation)) {
        return mutation.germlineFrequency;
    }
    else {
        return 0;
    }
}

function cancerTypeAccessor(mutation: IExtendedSignalMutation)
{
    return mutation.tumorTypeDecomposition
        // remove tumor types with non-zero frequency and unknown tumors
        .filter(c => c.frequency && c.frequency > 0 && isKnownTumorType(c.tumorType))
        // sort by frequency
        .sort((a, b) => Math.sign((b.frequency || 0) - (a.frequency || 0)))
        .map(c => c.tumorType);
}

function penetranceAccessor(mutation: IExtendedSignalMutation)
{
    return [mutation.penetrance];
}

@observer
class MutationMapper extends React.Component<IMutationMapperProps> {
    private signalMutationMapper: SignalMutationMapper | undefined;

    @computed
    get entrezGeneId() {
        return this.props.ensemblGene ?
            parseInt(this.props.ensemblGene.entrezGeneId, 10) : undefined;
    }

    @computed
    get showGermlinePercent() {
        return this.signalMutationMapper ? this.signalMutationMapper.showPercent : true;
    }

    @computed
    get showSomaticPercent() {
        return this.signalMutationMapper ? this.signalMutationMapper.showPercent : true;
    }

    @computed
    get dataFilters()
    {
        const filters: DataFilter[] = [{
            id: MUTATION_STATUS_FILTER_ID,
            type: MUTATION_STATUS_FILTER_TYPE,
            values: this.props.mutationStatuses || getDefaultMutationStatusFilterValues()
        }];

        if (this.props.cancerTypes) {
            filters.push({
                id: CANCER_TYPE_FILTER_ID,
                type: DataFilterType.CANCER_TYPE,
                values: this.props.cancerTypes
            });
        }

        return filters;
    }

    constructor(props: IMutationMapperProps) {
        super(props);
        makeObservable(this);
    }

    public render()
    {
        return (
            <SignalMutationMapper
                apiCacheLimit={API_CACHE_LIMIT}
                onInit={this.onMutationMapperInit}
                hugoSymbol={this.props.hugoSymbol}
                entrezGeneId={this.entrezGeneId}
                isoformOverrideSource={ISOFORM_OVERRIDE_SOURCE}
                data={this.props.data}
                showFilterResetPanel={false}
                showPlotLegendToggle={false}
                showPlotDownloadControls={false}
                showTranscriptDropDown={true}
                showOnlyAnnotatedTranscriptsInDropdown={true}
                filterMutationsBySelectedTranscript={true}
                mainLoadingIndicator={this.loader}
                oncoKbUrl={ONCOKB_API_URL}
                tracks={[TrackName.CancerHotspots, TrackName.OncoKB, TrackName.dbPTM, TrackName.UniprotPTM]}
                getMutationCount={this.getLollipopCountValue as (mutation: Partial<Mutation>) => number}
                mutationTableColumns={[
                    {
                        // override default Protein Change column to disable mutation status indicator
                        ...MUTATION_COLUMNS_DEFINITION[MutationColumn.PROTEIN_CHANGE],
                        Cell: (column: any) =>
                            <ProteinChange
                                mutation={column.original}
                                enableMutationStatusIndicator={false}
                            />
                    },
                    {
                        // override default Mutation Status column to include benign/pathogenic germline status
                        ...MUTATION_COLUMNS_DEFINITION[MutationColumn.MUTATION_STATUS],
                        accessor: mutationStatusAccessor as (mutation: Partial<Mutation>) => string,
                        width: 200,
                        Cell: renderMutationStatus
                    },
                    {
                        id: ColumnId.PENETRANCE,
                        Cell: renderPenetrance,
                        accessor: penetranceAccessor as (mutation: Partial<Mutation>) => string[],
                        Header: HEADER_COMPONENT[ColumnId.PENETRANCE],
                        sortMethod: sortPenetrance
                    },
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.MUTATION_TYPE],
                    {
                        id: ColumnId.MUTATION_PERCENT,
                        name: "% Prevalence",
                        Cell: renderPercentage,
                        accessor: mutationPercentAccessor as (mutation: Partial<Mutation>) => number,
                        Header: HEADER_COMPONENT[ColumnId.MUTATION_PERCENT],
                        sortMethod: defaultSortMethod
                    },
                    {
                        id: ColumnId.OVERALL_NUMBER_OF_GERMLINE_HOMOZYGOUS,
                        name: "% Germline Homozygous",
                        Cell: renderNumber,
                        accessor: "overallNumberOfGermlineHomozygous",
                        Header: HEADER_COMPONENT[ColumnId.OVERALL_NUMBER_OF_GERMLINE_HOMOZYGOUS],
                        sortMethod: defaultSortMethod
                    },
                    {
                        id: ColumnId.CANCER_TYPE,
                        name: "Cancer Type",
                        Cell: renderCancerType,
                        accessor: cancerTypeAccessor as (mutation: Partial<Mutation>) => string[],
                        Header: HEADER_COMPONENT[ColumnId.CANCER_TYPE],
                        sortMethod: defaultSortMethod
                    },
                    {
                        expander: true,
                        Expander: this.renderExpander,
                        togglable: false,
                        width: 25
                    },
                    {
                        id: ColumnId.PERCENT_BIALLELIC,
                        name: "% Loss of WT",
                        Cell: renderPercentage,
                        accessor: "ratioBiallelicPathogenic",
                        Header: HEADER_COMPONENT[ColumnId.PERCENT_BIALLELIC],
                        sortMethod: defaultSortMethod
                    },
                    {
                        ...MUTATION_COLUMNS_DEFINITION[MutationColumn.ANNOTATION],
                        Header: HEADER_COMPONENT[MutationColumn.ANNOTATION],
                        Cell: this.renderAnnotation,
                        // TODO disable sort for now due to an undesired sort behavior
                        //  (see https://github.com/cBioPortal/cbioportal/issues/8247)
                        sortable: false
                    },
                    {
                        // override default HGVSg column to customize the link
                        ...MUTATION_COLUMNS_DEFINITION[MutationColumn.HGVSG],
                        Cell: renderHgvsg,
                        width: 200
                    },
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.HGVSC],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.GNOMAD],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.CLINVAR],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.DBSNP],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.CHROMOSOME],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.START_POSITION],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.END_POSITION],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.REFERENCE_ALLELE],
                    MUTATION_COLUMNS_DEFINITION[MutationColumn.VARIANT_ALLELE]
                ]}
                customMutationTableProps={{
                    SubComponent: this.renderSubComponent
                }}
                // default mutation table waits for annotation column data by default to initiate sort
                // we don't sort by annotation column, so setting this to an empty array to bypass the initial wait
                mutationTableInitialSortRemoteData={[]}
                mutationTableInitialSort={[
                    {column: MutationColumn.MUTATION_STATUS, sortDirection: ColumnSortDirection.ASC},
                    {column: MutationColumn.PROTEIN_CHANGE, sortDirection: ColumnSortDirection.ASC},
                ]}
                groupFilters={
                    [
                        {
                            group: "Somatic",
                            filter: {type: DataFilterType.MUTATION, values: [{mutationStatus: "somatic"}]}
                        },
                        {
                            group: "Germline",
                            filter: {type: DataFilterType.MUTATION, values: [{mutationStatus: "germline"}]}
                        },
                    ]
                }
                plotYAxisLabelPadding={50}
                plotLollipopTooltipCountInfo={this.lollipopTooltipCountInfo as (count: number, mutations?: Partial<Mutation>[]) => JSX.Element}
                dataFilters={this.dataFilters}
                filterAppliersOverride={this.customFilterAppliers}
            />
        );
    }

    private get customFilterAppliers()
    {
        return {
            [DataFilterType.CANCER_TYPE]: this.applyCancerTypeFilter,
            [CANCER_TYPE_IGNORE_MUTATION_STATUS_FILTER_TYPE]: this.applyCancerTypeFilterIgnoreMutationStatus,
            [MUTATION_STATUS_FILTER_TYPE]: this.applyMutationStatusFilter,
            [MUTATION_COUNT_FILTER_TYPE]: this.applyMutationCountFilter
        };
    }

    @autobind
    private lollipopTooltipCountInfo(count: number, mutations?: IExtendedSignalMutation[]): JSX.Element
    {
        const decimalZeros = numberOfLeadingDecimalZeros(count);
        const fractionDigits = decimalZeros < 0 ? 1: decimalZeros + 2;

        return mutations && mutations.length > 0 && this.needToShowPercent(mutations[0]) ?
            <strong>{formatPercentValue(count, fractionDigits)}% mutation rate</strong>:
            <strong>{count} mutation{`${count !== 1 ? "s" : ""}`}</strong>;
    }

    @autobind
    private getDefaultMutationCount(mutation: IExtendedSignalMutation)
    {
        // take the current cancer type and mutation status filter into account
        const cancerTypeFilter = this.signalMutationMapper ? this.signalMutationMapper.cancerTypeFilter : undefined;
        const mutationStatusFilter = this.signalMutationMapper ? this.signalMutationMapper.mutationStatusFilter : undefined;

        return this.getMutationCount(mutation, cancerTypeFilter, mutationStatusFilter);
    }

    @autobind
    private getMutationCount(
        mutation: IExtendedSignalMutation,
        cancerTypeFilter?: DataFilter,
        mutationStatusFilter?: DataFilter)
    {
        return mutation.tumorTypeDecomposition
            .map(t => getVariantCount(mutation, t, cancerTypeFilter, mutationStatusFilter))
            .reduce((sum, count) => sum + count);
    }

    @autobind
    private getMutationRate(mutation: IExtendedSignalMutation)
    {
        const cancerTypeFilter = this.signalMutationMapper ? this.signalMutationMapper.cancerTypeFilter : undefined;
        const mutationStatusFilter = this.signalMutationMapper ? this.signalMutationMapper.mutationStatusFilter : undefined;

        return calculateMutationRate(mutation, cancerTypeFilter, mutationStatusFilter);
    }

    @autobind
    private getLollipopCountValue(mutation: IExtendedSignalMutation)
    {
        return this.needToShowPercent(mutation) ? this.getMutationRate(mutation) : this.getDefaultMutationCount(mutation);
    }

    private needToShowPercent(mutation: IExtendedSignalMutation)
    {
        return (
            mutation.mutationStatus.toLowerCase().includes(SignalMutationStatus.GERMLINE.toLowerCase()) &&
            this.showGermlinePercent
        ) || (
            mutation.mutationStatus.toLowerCase().includes(SignalMutationStatus.SOMATIC.toLowerCase()) &&
            this.showSomaticPercent
        );
    }

    private get mutationCountFilter() {
        return {
            type: MUTATION_COUNT_FILTER_TYPE,
            values: [0]
        };
    }

    @autobind
    private applyCancerTypeFilter(filter: CancerTypeFilter, mutation: IExtendedSignalMutation) {
        return applyCancerTypeFilter(filter, mutation) && this.applyMutationCountFilter(this.mutationCountFilter, mutation);
    }

    @autobind
    private applyCancerTypeFilterIgnoreMutationStatus(filter: CancerTypeFilter, mutation: IExtendedSignalMutation) {
        return applyCancerTypeFilter(filter, mutation) && this.applyMutationCountFilterIgnoreMutationStatus(this.mutationCountFilter, mutation);
    }

    @autobind
    private applyMutationStatusFilter(filter: MutationStatusFilter, mutation: IExtendedSignalMutation) {
        return applyMutationStatusFilter(filter, mutation) && this.applyMutationCountFilter(this.mutationCountFilter, mutation);
    }

    @autobind
    private applyMutationCountFilter(filter: MutationCountFilter, mutation: IExtendedSignalMutation) {
        return filter.values.map(v => this.getDefaultMutationCount(mutation) > v).includes(true);
    }

    @autobind
    private applyMutationCountFilterIgnoreMutationStatus(filter: MutationCountFilter, mutation: IExtendedSignalMutation) {
        return filter.values.map(
            v => this.getMutationCount(mutation, this.signalMutationMapper?.cancerTypeFilter) > v
        ).includes(true);
    }

    private get loader() {
        return loaderWithText("Annotating with Genome Nexus...");
    }

    @autobind
    private renderSubComponent(row: any) {
        return (
            <div className="p-4">
                <MutationTumorTypeFrequencyDecomposition
                    hugoSymbol={row.original.hugoSymbol}
                    dataPromise={
                        Promise.resolve(
                            row.original.tumorTypeDecomposition.filter(
                                (c: ISignalTumorTypeDecomposition) =>
                                    containsCancerType(
                                        this.signalMutationMapper ?
                                            this.signalMutationMapper.cancerTypeFilter : undefined,
                                        c.tumorType)
                            )
                        )
                    }
                />
            </div>
        );
    }

    @autobind
    private renderExpander(props: {isExpanded: boolean}) {
        return props.isExpanded ?
            <i className="fa fa-minus-circle" /> :
            <i className="fa fa-plus-circle" />;
    }

    @autobind
    private renderAnnotation(cellProps: any) {
        const mutation: IExtendedSignalMutation = cellProps.original;

        // disable certain annotations for germline mutations
        const props = this.signalMutationMapper ? {
            ...this.signalMutationMapper.defaultAnnotationColumnProps,
            mutation: mutation as any,
            enableOncoKb: isSomaticMutation(mutation) ?
                this.signalMutationMapper.defaultAnnotationColumnProps.enableOncoKb : false,
            enableHotspot: isSomaticMutation(mutation) ?
                this.signalMutationMapper.defaultAnnotationColumnProps.enableHotspot : false,
            enableMyCancerGenome: isSomaticMutation(mutation) ?
                this.signalMutationMapper.defaultAnnotationColumnProps.enableMyCancerGenome : false,
        }: undefined;

        return props ? <Annotation {...props} />: undefined;
    }

    @autobind
    private onMutationMapperInit(mutationMapper: SignalMutationMapper)
    {
        this.signalMutationMapper = mutationMapper;
    }
}

export default MutationMapper;

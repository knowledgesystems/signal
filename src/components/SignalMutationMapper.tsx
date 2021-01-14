import _ from "lodash";
import {action, computed, makeObservable, observable} from "mobx";
import {observer} from "mobx-react";
import pluralize from 'pluralize';
import * as React from 'react';
import {
    applyDataFilters,
    DataFilterType,
    FilterResetPanel,
    MutationMapper as ReactMutationMapper,
    MutationMapperProps,
    onFilterOptionSelect,
    ProteinImpactTypeBadgeSelector
} from "react-mutation-mapper";

import {
    CANCER_TYPE_FILTER_ID,
    CANCER_TYPE_IGNORE_MUTATION_STATUS_FILTER_TYPE,
    findCancerTypeFilter,
    findMutationStatusFilter,
    findMutationTypeFilter,
    getDefaultMutationStatusFilterValues,
    MUTATION_STATUS_FILTER_ID,
    MUTATION_STATUS_FILTER_TYPE,
    PROTEIN_IMPACT_TYPE_FILTER_ID
} from "../util/FilterUtils";
import {
    calculateTotalBiallelicRatio,
    calculateTotalFrequency,
    findAllUniqueCancerTypes,
    totalFilteredSamples
} from "../util/MutationDataUtils";
import CancerTypeSelector from "./CancerTypeSelector";
import MutationStatusSelector, {onMutationStatusFilterOptionSelect} from "./MutationStatusSelector";

import { SignalMutationStatus } from 'cbioportal-utils';
import {AxisScale, AxisScaleSwitch} from "./AxisScaleSwitch";
import "./SignalMutationMapper.css";

export interface ISignalMutationMapperProps extends MutationMapperProps
{
    onInit?: (mutationMapper: SignalMutationMapper) => void;
    percentChecked?: boolean;
    onScaleToggle?: (showPercent: boolean) => void;
}

const FILTER_UI_STYLE = {
    width: 250,
    paddingBottom: "1rem",
    fontSize: "85%"
};

@observer
export class SignalMutationMapper extends ReactMutationMapper<ISignalMutationMapperProps>
{
    @observable
    public showPercent = true;

    // last selected mutation status values (needed to determine checked/unchecked options after a user interaction)
    private lastSelectedMutationStatusValues: string[] = getDefaultMutationStatusFilterValues();

    @computed
    public get cancerTypes() {
        return findAllUniqueCancerTypes(this.props.data || []).sort();
    }

    @computed
    public get cancerTypesOptions() {
        return this.cancerTypes.map(t => ({value: t}));
    }

    @computed
    public get cancerTypeFilter() {
        return findCancerTypeFilter(this.store.dataStore.dataFilters);
    }

    @computed
    public get mutationStatusFilter() {
        return findMutationStatusFilter(this.store.dataStore.dataFilters);
    }

    @computed
    public get selectedMutationStatusValues() {
        // default values in case no filter
        let values = [
            {value: SignalMutationStatus.SOMATIC},
            {value: SignalMutationStatus.BENIGN_GERMLINE},
            {value: SignalMutationStatus.PATHOGENIC_GERMLINE}
        ];

        // no filter, return defaults
        if (!this.mutationStatusFilter) {
            return values;
        }
        else  {
            values = this.mutationStatusFilter.values.map(value => ({value}));

            // need to show PATHOGENIC_GERMLINE as selected when BIALLELIC_PATHOGENIC_GERMLINE is in the filter
            if (this.mutationStatusFilter.values.includes(SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE)) {
                values.push({value: SignalMutationStatus.PATHOGENIC_GERMLINE});
            }
        }

        // update last selection
        this.lastSelectedMutationStatusValues = values.map(v => v.value);

        return values;
    }

    @computed
    public get mutationTypeFilter() {
        return findMutationTypeFilter(this.store.dataStore.dataFilters);
    }

    @computed
    public get totalFilteredSamples() {
        return totalFilteredSamples(this.store.dataStore.sortedFilteredData, this.cancerTypeFilter);
    }

    @computed
    public get totalSamples() {
        return totalFilteredSamples(this.store.dataStore.allData);
    }

    // @computed
    // protected get plotTopYAxisSymbol() {
    //     return this.showPercent ? "%" : "#";
    // }

    // @computed
    // protected get plotBottomYAxisSymbol() {
    //     return this.showPercent ? "%" : "#";
    // }

    // @computed
    // protected get plotTopYAxisDefaultMax() {
    //     return this.showPercent ? 0 : 5;
    // }

    // @computed
    // protected get plotBottomYAxisDefaultMax() {
    //     return this.showPercent ? 0 : 5;
    // }



    constructor(props: ISignalMutationMapperProps)
    {
        super(props);
        makeObservable(this);
        if (props.onInit) {
            props.onInit(this);
        }
    }
    protected getPlotYMaxLabelPostfix() {
        return this.showPercent ? "%" : "";
    }

    protected getPlotBottomYAxisDefaultMax() {
        return this.showPercent ? 0 : 5;
    }

    protected  getPlotTopYAxisDefaultMax() {
        return this.showPercent ? 0 : 5;
    }

    protected getPlotBottomYAxisSymbol() {
        return this.showPercent ? "%" : "#";
    }

    protected getPlotTopYAxisSymbol() {
        return this.showPercent ? "%" : "#";
    }

    /**
     * Overriding the parent method to have a customized filter panel.
     */
    protected get mutationFilterPanel(): JSX.Element | null
    {
        return (
            <div className="signal-mutation-filter-panel">
                <div style={FILTER_UI_STYLE}>
                    <strong>
                        {this.totalFilteredSamples.toLocaleString('en-US')}
                        {this.totalSamples !== this.totalFilteredSamples && ` / ${this.totalSamples.toLocaleString('en-US')}`}
                    </strong> {pluralize(`total sample`, this.totalFilteredSamples)}
                </div>
                <div style={FILTER_UI_STYLE}>
                    <MutationStatusSelector
                        selectedValues={this.selectedMutationStatusValues}
                        onSelect={this.onMutationStatusSelect}
                        rates={this.mutationRatesByMutationStatus}
                    />
                </div>
                <div style={FILTER_UI_STYLE}>
                    <ProteinImpactTypeBadgeSelector
                        filter={this.mutationTypeFilter}
                        counts={this.store.mutationCountsByProteinImpactType}
                        onSelect={this.onProteinImpactTypeSelect}
                    />
                </div>
                <div style={FILTER_UI_STYLE}>
                    <CancerTypeSelector
                        filter={this.cancerTypeFilter}
                        options={this.cancerTypesOptions}
                        onSelect={this.onCancerTypeSelect}
                    />
                </div>
            </div>
        );
    }

    /**
     * Override the parent method to get custom controls.
     */
    protected get customControls(): JSX.Element | undefined
    {
        return this.percentToggle;
    }

    protected get percentToggle(): JSX.Element | undefined
    {
        return (
            <div className="small" style={{display: "flex", alignItems: "center"}}>
                <span style={{marginLeft: 10, marginRight: 10}}>Y-Axis: </span>
                <AxisScaleSwitch
                    selectedScale={this.showPercent ? AxisScale.PERCENT: AxisScale.COUNT}
                    onChange={this.onScaleToggle}
                />
            </div>
        );
    }

    /**
     * Overriding the parent method to have customized mutation info
     */
    @computed
    protected get mutationTableInfo(): JSX.Element | undefined
    {
        const uniqueMutationCount = this.store.dataStore.allData.length;
        const filteredUniqueMutationCount = this.store.dataStore.sortedFilteredSelectedData.length > 0 ?
            this.store.dataStore.sortedFilteredSelectedData.length : this.store.dataStore.sortedFilteredData.length;

        const mutations =
            <span>
                <strong>
                    {filteredUniqueMutationCount}
                    {uniqueMutationCount !== filteredUniqueMutationCount && `/${uniqueMutationCount}`}
                </strong> {filteredUniqueMutationCount === 1 ? `unique mutation` : `unique mutations`}
            </span>;

        const filtering = this.isFiltered ? "based on current filtering": null;

        const info = <span>{mutations} {filtering}</span>;

        return this.isFiltered ? (
            <FilterResetPanel
                resetFilters={this.resetFilters}
                filterInfo={info}
                className=""
            />
        ): info;
    }

    public get defaultAnnotationColumnProps() {
        // TODO most of this code is duplicated from react-mutation-mapper
        //  we should make the default props accessible if possible
        return {
            enableOncoKb: true,
            enableHotspot: true,
            enableCivic: this.props.enableCivic || false,
            enableMyCancerGenome: true,
            hotspotData: this.store.indexedHotspotData,
            oncoKbData: this.store.oncoKbData,
            oncoKbCancerGenes: this.store.oncoKbCancerGenes,
            usingPublicOncoKbInstance: this.store.usingPublicOncoKbInstance,
            pubMedCache: this.pubMedCache,
            civicGenes: this.store.civicGenes,
            civicVariants: this.store.civicVariants
        };
    }

    @computed
    public get mutationRatesByMutationStatus() {
        // TODO pick only likely driver ones, not all somatic mutations
        const somaticFilter = {
            type: MUTATION_STATUS_FILTER_TYPE,
            values: [SignalMutationStatus.SOMATIC]
        };

        const benignGermlineFilter = {
            type: MUTATION_STATUS_FILTER_TYPE,
            values: [SignalMutationStatus.BENIGN_GERMLINE]
        };

        const pathogenicGermlineFilter = {
            type: MUTATION_STATUS_FILTER_TYPE,
            values: [SignalMutationStatus.PATHOGENIC_GERMLINE]
        };

        const biallelicPathogenicGermlineFilter = {
            type: MUTATION_STATUS_FILTER_TYPE,
            values: [SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE]
        };

        const filtersWithoutMutationStatusFilter = this.store.dataStore.dataFilters
            .filter(f => f.id !== MUTATION_STATUS_FILTER_ID)
            // we cannot directly apply the default cancer type filter, we need to ignore mutation status
            .map(f => f.id === CANCER_TYPE_FILTER_ID ?
                {...f, type: CANCER_TYPE_IGNORE_MUTATION_STATUS_FILTER_TYPE}: f);

        // apply filters excluding the mutation status filter
        // this prevents ratio of unchecked mutation status values from being calculated as zero
        const sortedFilteredData = applyDataFilters(
            this.store.dataStore.allData, filtersWithoutMutationStatusFilter, this.store.dataStore.applyFilter);

        const somaticFrequency = calculateTotalFrequency(
            sortedFilteredData, somaticFilter, this.cancerTypeFilter);
        const benignGermlineFrequency = calculateTotalFrequency(
            sortedFilteredData, benignGermlineFilter, this.cancerTypeFilter);
        const pathogenicGermlineFrequency = calculateTotalFrequency(
            sortedFilteredData, pathogenicGermlineFilter, this.cancerTypeFilter);
        const biallelicRatio = calculateTotalBiallelicRatio(
            sortedFilteredData, pathogenicGermlineFilter, biallelicPathogenicGermlineFilter, this.cancerTypeFilter);

        return {
            [SignalMutationStatus.SOMATIC]: (somaticFrequency || 0) * 100,
            [SignalMutationStatus.BENIGN_GERMLINE]: (benignGermlineFrequency || 0) * 100,
            [SignalMutationStatus.PATHOGENIC_GERMLINE]: (pathogenicGermlineFrequency || 0) * 100,
            [SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE]: (biallelicRatio || 0) * 100,
        };
    }

    @action.bound
    protected onCancerTypeSelect(selectedCancerTypeIds: string[], allValuesSelected: boolean)
    {
        onFilterOptionSelect(selectedCancerTypeIds,
            allValuesSelected,
            this.store.dataStore,
            DataFilterType.CANCER_TYPE,
            CANCER_TYPE_FILTER_ID);
    }

    @action.bound
    protected onMutationStatusSelect(selectedMutationStatusIds: string[], allValuesSelected: boolean)
    {
        const checkedMutationStatusValues = _.difference(
            selectedMutationStatusIds, this.lastSelectedMutationStatusValues);
        const uncheckedMutationStatusValues = _.difference(
            this.lastSelectedMutationStatusValues, selectedMutationStatusIds);

        onMutationStatusFilterOptionSelect(selectedMutationStatusIds,
            checkedMutationStatusValues,
            uncheckedMutationStatusValues,
            allValuesSelected,
            this.store.dataStore,
            MUTATION_STATUS_FILTER_TYPE,
            MUTATION_STATUS_FILTER_ID);
    }

    @action.bound
    protected onProteinImpactTypeSelect(selectedMutationTypeIds: string[], allValuesSelected: boolean)
    {
        onFilterOptionSelect(selectedMutationTypeIds.map(v => v.toLowerCase()),
            allValuesSelected,
            this.store.dataStore,
            DataFilterType.PROTEIN_IMPACT_TYPE,
            PROTEIN_IMPACT_TYPE_FILTER_ID);
    }

    @action.bound
    private onScaleToggle(selectedScale: AxisScale)
    {
        this.lollipopPlotControlsConfig.yMaxInput = undefined;
        this.lollipopPlotControlsConfig.bottomYMaxInput = undefined;

        this.showPercent = selectedScale === AxisScale.PERCENT;

        if (this.props.onScaleToggle) {
            this.props.onScaleToggle(this.showPercent);
        }
    }
    
}

export default SignalMutationMapper;

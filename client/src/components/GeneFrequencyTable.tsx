import * as React from "react";
import ReactTable from "react-table";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";
import {DataStatus} from "../store/DataStatus";
import {fetchMutationsByGene} from "../store/DataUtils";
import FrequencyCell from "./FrequencyCell";
import TumorTypeFrequencyTable from "./TumorTypeFrequencyTable";

import "react-table/react-table.css";
import "./FrequencyTable.css";

interface IFrequencyTableProps
{
    data: IAggregatedMutationFrequencyByGene[];
    status: DataStatus;
}

// TODO duplicate server side code, remove after resolving import from server issues
enum MutationCategory {
    DEFAULT = "NA",
    SOMATIC = "somaticByGene",
    GERMLINE = "germlineByGene",
    BIALLELIC_GERMLINE = "biallelicGermlineByGene",
    QC_GERMLINE = "qcGermlineByGene",
    BIALLELIC_QC_OVERRIDDEN_GERMLINE = "biallelicQCOverriddenGermlineByGene"
}


function renderPercentage(frequency: number, hugoSymbol: string, category: MutationCategory, pathogenic?: boolean)
{
    function overlay() {
        return (
            <TumorTypeFrequencyTable
                dataPromise={fetchMutationsByGene(hugoSymbol, category, pathogenic)}
            />
        );
    }

    return (
        <FrequencyCell
            frequency={frequency}
            overlay={overlay}
        />
    );
}

function renderSomatic(cellProps: any) {
    return renderPercentage(cellProps.value,
        cellProps.original.hugoSymbol,
        MutationCategory.SOMATIC);
}

function renderGermline(cellProps: any) {
    return renderPercentage(cellProps.value,
        cellProps.original.hugoSymbol,
        MutationCategory.GERMLINE,
        true);
}

function renderBiallelic(cellProps: any) {
    return renderPercentage(cellProps.value,
        cellProps.original.hugoSymbol,
        MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE,
        true);
}

export function somaticAccessor(aggregatedFrequency: IAggregatedMutationFrequencyByGene) {
    const somaticFrequencies = aggregatedFrequency.frequencies.filter(
        f => f.category === MutationCategory.SOMATIC);

    return somaticFrequencies.length > 0 ? somaticFrequencies[0].all : null;
}

export function germlineAccessor(aggregatedFrequency: IAggregatedMutationFrequencyByGene) {
    const germlineFrequencies = aggregatedFrequency.frequencies.filter(
        f => f.category === MutationCategory.GERMLINE);

    return germlineFrequencies.length > 0 ? germlineFrequencies[0].pathogenic : null;
}

export function biallelicAccessor(aggregatedFrequency: IAggregatedMutationFrequencyByGene) {
    const biallelicFrequencies = aggregatedFrequency.frequencies.filter(
        f => f.category === MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE);

    return biallelicFrequencies.length > 0 ? biallelicFrequencies[0].pathogenic : null;
}

class GeneFrequencyTable extends React.Component<IFrequencyTableProps>
{
    public render() {

        return (
            <div className="insight-frequency-table">
                <ReactTable
                    data={this.props.data}
                    loading={this.props.status === 'pending'}
                    loadingText={<i className="fa fa-refresh fa-spin fa-2x" />}
                    columns={[
                        {
                            Header: "Gene",
                            accessor: "hugoSymbol",
                        },
                        {
                            Header: "Mutation Frequencies",
                            columns: [
                                {
                                    id: "somatic",
                                    Cell: renderSomatic,
                                    Header: "Somatic",
                                    accessor: somaticAccessor
                                },
                                {
                                    id: "germline",
                                    Cell: renderGermline,
                                    Header: "Pathogenic Germline",
                                    accessor: germlineAccessor
                                },
                                {
                                    id: "biallelic",
                                    Cell: renderBiallelic,
                                    Header: "Biallelic Pathogenic Germline",
                                    accessor: biallelicAccessor
                                },
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    previousText="<"
                    nextText=">"
                />
            </div>
        );
    }
}

export default GeneFrequencyTable;

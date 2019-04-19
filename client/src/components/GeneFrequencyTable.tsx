import * as React from "react";
import ReactTable from "react-table";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";
import {DataStatus} from "../store/DataStatus";
import {fetchMutationsByGeneAndCategories} from "../store/DataUtils";
import {ColumnId, HEADER_COMPONENT} from "./ColumnHeaderHelper";
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
export enum MutationCategory {
    DEFAULT = "NA",
    SOMATIC = "somaticByGene",
    GERMLINE = "germlineByGene",
    BIALLELIC_GERMLINE = "biallelicGermlineByGene",
    QC_GERMLINE = "qcGermlineByGene",
    BIALLELIC_QC_OVERRIDDEN_GERMLINE = "biallelicQCOverriddenGermlineByGene"
}


function renderPercentage(cellProps: any)
{
    return (
        <FrequencyCell frequency={cellProps.value || 0} />
    );
}

function renderSubComponent(row: any) {
    return (

            <div className="p-4">
                <TumorTypeFrequencyTable
                    hugoSymbol={row.original.hugoSymbol}
                    dataPromise={
                        fetchMutationsByGeneAndCategories(row.original.hugoSymbol, [
                            {category: MutationCategory.SOMATIC},
                            {category: MutationCategory.GERMLINE, pathogenic: true},
                            {category: MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE, pathogenic: true}
                        ])
                    }
                />
            </div>

    );
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
                    loadingText={<i className="fa fa-spinner fa-pulse fa-2x" />}
                    columns={[
                        {
                            Header: "Gene",
                            accessor: "hugoSymbol",
                            defaultSortDesc: false
                        },
                        {
                            Header: HEADER_COMPONENT[ColumnId.MUTATION_FREQUENCIES],
                            columns: [
                                {
                                    id: ColumnId.SOMATIC,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.SOMATIC],
                                    accessor: somaticAccessor
                                },
                                {
                                    id: ColumnId.GERMLINE,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.GERMLINE],
                                    accessor: germlineAccessor
                                },
                                {
                                    id: ColumnId.BIALLELIC,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.BIALLELIC],
                                    accessor: biallelicAccessor
                                },
                            ]
                        },
                        {
                            expander: true,
                            Expander: <i className="fa fa-plus-circle" />
                        }
                    ]}
                    SubComponent={renderSubComponent}
                    defaultPageSize={10}
                    defaultSorted={[{
                        id: "germline",
                        desc: true
                    }]}
                    defaultSortDesc={true}
                    className="-striped -highlight"
                    previousText="<"
                    nextText=">"
                />
            </div>
        );
    }
}

export default GeneFrequencyTable;

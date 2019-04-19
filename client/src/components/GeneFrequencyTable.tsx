import * as React from "react";
import ReactTable from "react-table";

import {IGeneFrequencySummary} from "../../../server/src/model/GeneFrequencySummary";
import {DataStatus} from "../store/DataStatus";
import {biallelicAccessor, germlineAccessor, somaticAccessor} from "../util/ColumnHelper";
import {fetchTumorTypeFrequenciesByGene} from "../util/FrequencyDataUtils";
import {ColumnId, HEADER_COMPONENT} from "./ColumnHeaderHelper";
import FrequencyCell from "./FrequencyCell";
import TumorTypeFrequencyTable from "./TumorTypeFrequencyTable";

import "react-table/react-table.css";
import "./FrequencyTable.css";
import Gene from "./Gene";

interface IFrequencyTableProps
{
    data: IGeneFrequencySummary[];
    status: DataStatus;
}


function renderPercentage(cellProps: any)
{
    return (
        <FrequencyCell frequency={cellProps.value || 0} />
    );
}

function renderHugoSymbol(cellProps: any)
{
    return (
        <Gene
            hugoSymbol={cellProps.value}
            penetrance={cellProps.original.penetrance.split(",")}
        />
    );
}

function renderSubComponent(row: any) {
    return (
        <div className="p-4">
            <TumorTypeFrequencyTable
                hugoSymbol={row.original.hugoSymbol}
                penetrance={row.original.penetrance.split(",")}
                dataPromise={fetchTumorTypeFrequenciesByGene(row.original.hugoSymbol)}
            />
        </div>
    );
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
                            id: "hugoSymbol",
                            Cell: renderHugoSymbol,
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
                                }
                            ]
                        },
                        {
                            id: ColumnId.PERCENT_BIALLELIC,
                            Cell: renderPercentage,
                            Header: HEADER_COMPONENT[ColumnId.PERCENT_BIALLELIC],
                            accessor: biallelicAccessor
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

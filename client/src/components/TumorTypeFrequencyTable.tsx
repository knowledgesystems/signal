import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import ReactTable from "react-table";

import {ITumorTypeFrequencySummary} from "../../../server/src/model/GeneFrequencySummary";
import {DataStatus} from "../store/DataStatus";
import {biallelicAccessor, germlineAccessor, somaticAccessor} from "../util/ColumnHelpers";
import {ColumnId, HEADER_COMPONENT} from "./ColumnHeaderHelper";
import FrequencyCell from "./FrequencyCell";

import "react-table/react-table.css";
import "./FrequencyTable.css";

interface ITumorTypeFrequencyTableProps
{
    dataPromise: Promise<ITumorTypeFrequencySummary[]>;
    hugoSymbol: string;
}

function renderPercentage(cellProps: any)
{
    return (
        <FrequencyCell
            frequency={cellProps.value}
        />
    );
}

function renderCount(cellProps: any)
{
    return <span className="pull-right mr-1">{cellProps.value}</span>;
}

function renderTumorType(cellProps: any)
{
    return <span className="pull-left ml-2">{cellProps.value}</span>;
}

@observer
class TumorTypeFrequencyTable extends React.Component<ITumorTypeFrequencyTableProps>
{
    @observable
    private data: ITumorTypeFrequencySummary[] = [];

    @observable
    private status: DataStatus = 'pending';

    public render()
    {
        return (
            <div className="insight-frequency-table">
                <ReactTable
                    onFetchData={this.onFetchData}
                    data={this.data}
                    loading={this.status === 'pending'}
                    loadingText={<i className="fa fa-spinner fa-pulse fa-2x" />}
                    columns={[
                        {
                            Header: <strong className="pull-left ml-4">{this.props.hugoSymbol}</strong>,
                            columns: [
                                {
                                    id: "tumorType",
                                    Cell: renderTumorType,
                                    Header: <span className="text-wrap">Tumor type</span>,
                                    accessor: "tumorType",
                                    minWidth: 250
                                },
                                {
                                    id: "sampleCount",
                                    Cell: renderCount,
                                    Header: <span className="text-wrap"># Samples</span>,
                                    accessor: "sampleCount",
                                    maxWidth: 80
                                }
                            ]
                        },
                        {
                            Header: HEADER_COMPONENT[ColumnId.MUTATION_FREQUENCIES],
                            columns: [
                                {
                                    id: ColumnId.SOMATIC,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.SOMATIC],
                                    accessor: somaticAccessor,
                                    maxWidth: 120
                                },
                                {
                                    id: ColumnId.GERMLINE,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.GERMLINE],
                                    accessor: germlineAccessor,
                                    maxWidth: 120
                                }
                            ]
                        },
                        {
                            id: ColumnId.PERCENT_BIALLELIC,
                            Cell: renderPercentage,
                            Header: HEADER_COMPONENT[ColumnId.PERCENT_BIALLELIC],
                            accessor: biallelicAccessor,
                            maxWidth: 120
                        }
                    ]}
                    defaultSorted={[{
                        id: ColumnId.GERMLINE,
                        desc: true
                    }]}
                    defaultSortDesc={true}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    previousText="<"
                    nextText=">"
                />
            </div>
        );
    }

    @action.bound
    private onFetchData() {
        this.props.dataPromise
            .then(frequencies => {
                this.data = frequencies;
                this.status = 'complete';
            })
            .catch(err => this.status = 'error');
    }
}

export default TumorTypeFrequencyTable;

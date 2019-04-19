import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import ReactTable from "react-table";

import {IMutation} from "../../../server/src/model/Mutation";
import {DataStatus} from "../store/DataStatus";
import {extractAggregatedTumorTypeFrequencyData} from "../store/DataUtils";
import {ColumnId, HEADER_COMPONENT} from "./ColumnHeaderHelper";
import FrequencyCell from "./FrequencyCell";
import {MutationCategory} from "./GeneFrequencyTable"; // TODO replace with server side model

import "react-table/react-table.css";
import "./FrequencyTable.css";

interface ITumorTypeFrequencyTableProps
{
    dataPromise: Promise<IMutation[]>;
    hugoSymbol: string;
}

export interface ITumorTypeFrequencyData
{
    cancerType: string;
    counts : ISampleCount[];
}

interface ISampleCount
{
    category: MutationCategory;
    tumorTypeCount: number;
    variantCount: number;
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

function somaticAccessor(row: any)
{
    const count = row.counts.find((c: ISampleCount) => c.category === MutationCategory.SOMATIC);
    return calculateFrequency(count);
}

function germlineAccessor(row: any)
{
    const count = row.counts.find((c: ISampleCount) => c.category === MutationCategory.GERMLINE);
    return calculateFrequency(count);
}

function biallelicAccessor(row: any)
{
    const count = row.counts.find((c: ISampleCount) => c.category === MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE);
    return calculateFrequency(count);
}

function biallelicToGermlineRatioAccessor(row: any)
{
    const biallelicFrequency = biallelicAccessor(row);
    const germlineFrequency = germlineAccessor(row);

    return biallelicFrequency > 0 && germlineFrequency > 0 ?
        biallelicFrequency / germlineFrequency : 0;
}

function tumorTypeCountAccessor(row: any)
{
    return Math.max(...row.counts.map((c: ISampleCount) => c.tumorTypeCount));
}

function calculateFrequency(count?: ISampleCount)
{
    if (count) {
        return count.variantCount / count.tumorTypeCount;
    }
    else {
        return 0;
    }
}

@observer
class TumorTypeFrequencyTable extends React.Component<ITumorTypeFrequencyTableProps>
{
    @observable
    private data: ITumorTypeFrequencyData[] = [];

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
                                    id: "cancerType",
                                    Cell: renderTumorType,
                                    Header: <span className="text-wrap">Tumor type</span>,
                                    accessor: "cancerType",
                                    minWidth: 250
                                },
                                {
                                    id: "tumorTypeCount",
                                    Cell: renderCount,
                                    Header: <span className="text-wrap"># Samples</span>,
                                    accessor: tumorTypeCountAccessor,
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
                                    maxWidth: 100
                                },
                                {
                                    id: ColumnId.GERMLINE,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.GERMLINE],
                                    accessor: germlineAccessor,
                                    maxWidth: 100
                                },
                                {
                                    id: ColumnId.BIALLELIC,
                                    Cell: renderPercentage,
                                    Header: HEADER_COMPONENT[ColumnId.BIALLELIC],
                                    accessor: biallelicAccessor,
                                    maxWidth: 100
                                }
                            ]
                        },
                        {
                            id: ColumnId.BIALLELIC_TO_GERMLINE_RATIO,
                            Cell: renderPercentage,
                            Header: HEADER_COMPONENT[ColumnId.BIALLELIC_TO_GERMLINE_RATIO],
                            accessor: biallelicToGermlineRatioAccessor,
                            maxWidth: 100
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
            .then(mutations => {
                this.data = extractAggregatedTumorTypeFrequencyData(mutations);
                this.status = 'complete';
            })
            .catch(err => this.status = 'error');
    }
}

export default TumorTypeFrequencyTable;

import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";
import ReactTable from "react-table";

import {IMutation} from "../../../server/src/model/Mutation";
import {DataStatus} from "../store/DataStatus";
import {extractTumorTypeFrequencyData} from "../store/DataUtils";
import FrequencyCell from "./FrequencyCell";

import "react-table/react-table.css";
import "./FrequencyTable.css";

interface ITumorTypeFrequencyTableProps
{
    dataPromise: Promise<IMutation[]>;
}

export interface ITumorTypeFrequency
{
    cancerType: string;
    variantCount: number;
    tumorTypeCount: number;
}

function renderPercentage(cellProps: any) {
    return (
        <FrequencyCell
            frequency={cellProps.value}
        />
    );
}

@observer
class TumorTypeFrequencyTable extends React.Component<ITumorTypeFrequencyTableProps>
{
    @observable
    private data: ITumorTypeFrequency[] = [];

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
                    loadingText={<i className="fa fa-refresh fa-spin fa-2x" />}
                    columns={[
                        {
                            Header: <span className="text-wrap">Tumor Type</span>,
                            accessor: "cancerType"
                        },
                        {
                            Header: <span className="text-wrap"># Samples with variant</span>,
                            accessor: "variantCount"
                        },
                        {
                            Header: <span className="text-wrap">Total samples</span>,
                            accessor: "tumorTypeCount"
                        },
                        {
                            id: "frequency",
                            Cell: renderPercentage,
                            Header: "Frequency",
                            accessor: row => row.variantCount / row.tumorTypeCount
                        }
                    ]}
                    defaultSorted={[{
                        id: "frequency",
                        desc: true
                    }]}
                    defaultPageSize={5}
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
                this.data = extractTumorTypeFrequencyData(mutations)[0];
                this.status = 'complete';
            })
            .catch(err => this.status = 'error');
    }
}

export default TumorTypeFrequencyTable;

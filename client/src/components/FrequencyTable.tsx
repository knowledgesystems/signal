import * as React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";

interface IMutationTableProps
{
    data: IAggregatedMutationFrequencyByGene[];
}

class FrequencyTable extends React.Component<IMutationTableProps>
{
    public render() {

        return (
            <div style={{fontSize: "1rem"}}>
                <ReactTable
                    data={this.props.data}
                    columns={[
                        {
                            Header: "Gene",
                            accessor: "hugoSymbol",
                        },
                        {
                            Header: "Mutation Frequencies",
                            columns: [
                                {
                                    Header: "Somatic",
                                    accessor: "somaticFrequency.all"
                                },
                                {
                                    Header: "Pathogenic Germline",
                                    accessor: "germlineFrequency.pathogenic"
                                },
                                {
                                    Header: "Biallelic Pathogenic Germline",
                                    accessor: "biallelicFrequency.pathogenic"
                                },
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

export default FrequencyTable;

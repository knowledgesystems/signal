import * as React from "react";
import ReactTable from "react-table";

import "react-table/react-table.css";

interface IMutationTableProps
{
    data: any[]; // TODO Mutation[]
}

class MutationTable extends React.Component<IMutationTableProps>
{
    public render() {

        function expanderHeader(): JSX.Element {
            return <strong>More</strong>;
        }

        function expander(isExpanded: boolean, ...rest:any[]): JSX.Element
        {
            return (
                <div>
                    {isExpanded
                        ? <span>&#x2299;</span>
                        : <span>&#x2295;</span>}
                </div>
            );
        }

        // TODO row: Mutation
        function subComponent(row: any): JSX.Element
        {
            return (
                <div style={{padding: '10px'}}>
                    TODO: Visualize Frequencies Here?
                </div>
            );
        }

        return (
            <div>
                <ReactTable
                    data={this.props.data}
                    columns={[
                        {
                            Header: "Gene",
                            accessor: "Hugo_Symbol",
                        },
                        {
                            Header: "HGVS",
                            columns: [
                                {
                                    Header: "c",
                                    accessor: "HGVSc"
                                },
                                {
                                    Header: "p (short)",
                                    accessor: "HGVSp_Short"
                                }
                            ]
                        },
                        {
                            Header: "Genomic Location",
                            columns: [
                                {
                                    Header: "Chromosome",
                                    accessor: "Chromosome"
                                },
                                {
                                    Header: "Start",
                                    accessor: "Start_Position"
                                },
                                {
                                    Header: "End",
                                    accessor: "End_Position"
                                },
                                {
                                    Header: "Ref",
                                    accessor: "Reference_Allele"
                                },
                                {
                                    Header: "Alt",
                                    accessor: "Alternate_Allele"
                                }
                            ]
                        },
                        // TODO Variant_Classification, Variant_Type, dbSNP_RS, classifier_pathogenic_final, penetrance
                        {
                            Header: "Expand",
                            columns: [
                                {
                                    expander: true,
                                    Header: expanderHeader,
                                    width: 65,
                                    Expander: expander,
                                    style: {
                                        cursor: "pointer",
                                        fontSize: 25,
                                        padding: "0",
                                        textAlign: "center",
                                        userSelect: "none"
                                    }
                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    SubComponent={subComponent}
                />
            </div>
        );
    }
}

export default MutationTable;

import * as React from "react";
import ReactTable from "react-table";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";
import {fetchMutationsByGene} from "../store/DataUtils";
import FrequencyCell from "./FrequencyCell";
import TumorTypeFrequencyTable from "./TumorTypeFrequencyTable";

import "react-table/react-table.css";
import "./FrequencyTable.css";

interface IFrequencyTableProps
{
    data: IAggregatedMutationFrequencyByGene[];
}

function renderPercentage(cellProps: any)
{
    function overlay() {
        // TODO category
        return (
            <TumorTypeFrequencyTable
                dataPromise={fetchMutationsByGene(cellProps.original.hugoSymbol)}
            />
        );
    }

    return (
        <FrequencyCell
            frequency={cellProps.value}
            overlay={overlay}
        />
    );
}

class GeneFrequencyTable extends React.Component<IFrequencyTableProps>
{
    public render() {

        return (
            <div className="insight-frequency-table">
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
                                    Cell: renderPercentage,
                                    Header: "Somatic",
                                    accessor: "somaticFrequency.all"
                                },
                                {
                                    Cell: renderPercentage,
                                    Header: "Pathogenic Germline",
                                    accessor: "germlineFrequency.pathogenic"
                                },
                                {
                                    Cell: renderPercentage,
                                    Header: "Biallelic Pathogenic Germline",
                                    accessor: "biallelicFrequency.pathogenic"
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

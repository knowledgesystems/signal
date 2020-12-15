import {action, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

import {ISignalTumorTypeDecomposition} from "cbioportal-utils";
import {DataStatus} from "../store/DataStatus";

import "react-table/react-table.css";
import { MutationTumorTypeFrequencyTable } from 'react-variant-view';

interface ITumorTypeFrequencyDecompositionProps
{
    dataPromise: Promise<ISignalTumorTypeDecomposition[]>;
    hugoSymbol: string;
}

@observer
class MutationTumorTypeFrequencyDecomposition extends React.Component<ITumorTypeFrequencyDecompositionProps>
{
    @observable
    private data: ISignalTumorTypeDecomposition[] = [];

    @observable
    private status: DataStatus = 'pending';

    public render()
    {
        return this.status === 'pending' ? (
            <i className="fa fa-spinner fa-pulse fa-2x" />
        ): (
            <MutationTumorTypeFrequencyTable
                data={this.data}
            />
        );
    }

    public componentDidMount()
    {
        this.props.dataPromise
            .then(this.handleDataLoad)
            .catch(this.handleDataError);
    }

    @action.bound
    private handleDataLoad(frequencies: ISignalTumorTypeDecomposition[]) {
        this.data = frequencies;
        this.status = 'complete';
    }

    @action.bound
    private handleDataError(reason: any) {
        this.status = 'error';
    }
}

export default MutationTumorTypeFrequencyDecomposition;

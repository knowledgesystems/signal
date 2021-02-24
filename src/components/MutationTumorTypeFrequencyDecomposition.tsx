import {action, makeObservable, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

import {MutationTumorTypeFrequencyTable} from 'cbioportal-frontend-commons';
import {ISignalTumorTypeDecomposition} from "cbioportal-utils";

import {DataStatus} from "../store/DataStatus";

import "react-table/react-table.css";

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

    constructor(props: ITumorTypeFrequencyDecompositionProps) {
        super(props);
        makeObservable(this);
    }

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
        // filter out cancer types with zero frequency
        this.data = frequencies.filter(f => f.frequency && f.frequency > 0);
        this.status = 'complete';
    }

    @action.bound
    private handleDataError(reason: any) {
        this.status = 'error';
    }
}

export default MutationTumorTypeFrequencyDecomposition;

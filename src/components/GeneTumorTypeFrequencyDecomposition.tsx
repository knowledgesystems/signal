import {action, makeObservable, observable} from "mobx";
import {observer} from "mobx-react";
import * as React from "react";

import {ISignalTumorTypeFrequencySummary} from "cbioportal-utils";
import {DataStatus} from "../store/DataStatus";

import "react-table/react-table.css";
import GeneTumorTypeFrequencyTable from "./GeneTumorTypeFrequencyTable";

interface ITumorTypeFrequencyDecompositionProps
{
    dataPromise: Promise<ISignalTumorTypeFrequencySummary[]>;
    penetrance: string[];
    hugoSymbol: string;
}

@observer
class GeneTumorTypeFrequencyDecomposition extends React.Component<ITumorTypeFrequencyDecompositionProps>
{
    @observable
    private data: ISignalTumorTypeFrequencySummary[] = [];

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
            <GeneTumorTypeFrequencyTable
                data={this.data}
                penetrance={this.props.penetrance}
                hugoSymbol={this.props.hugoSymbol}
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
    private handleDataLoad(frequencies: ISignalTumorTypeFrequencySummary[]) {
        this.data = frequencies;
        this.status = 'complete';
    }

    @action.bound
    private handleDataError(reason: any) {
        this.status = 'error';
    }
}

export default GeneTumorTypeFrequencyDecomposition;

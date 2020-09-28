import _ from 'lodash';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import {Row} from 'react-bootstrap';

import GeneLevelSummary from "../components/GeneLevelSummary";
import PenetranceFilterPanel from "../components/PenetranceFilterPanel";
import {PenetranceLevel} from "../model/Penetrance";
import GeneFrequencyStore from "../store/GeneFrequencyStore";
import {PENETRANCE_FILTER_ID, PENETRANCE_FILTER_TYPE, PenetranceFilter} from "../util/FilterUtils";

interface IExploreProps {
    frequencyStore?: GeneFrequencyStore;
    penetrance?: PenetranceLevel;
}

@observer
class Explore extends React.Component<IExploreProps>
{
    @observable
    public selectedPenetranceLevels: PenetranceLevel[] = [];

    @computed
    public get penetranceFilter(): PenetranceFilter | undefined
    {
        return this.selectedPenetranceLevels.length > 0 ? {
            id: PENETRANCE_FILTER_ID,
            type: PENETRANCE_FILTER_TYPE,
            values: this.selectedPenetranceLevels
        }: undefined;
    }

    constructor(props: IExploreProps) {
        super(props);

        if (this.props.penetrance) {
            this.selectedPenetranceLevels = [this.props.penetrance];
        }

        if (this.props.frequencyStore) {
            this.props.frequencyStore.geneFrequencySummaryPenetranceFilter = this.penetranceFilter;
        }
    }

    private get blurb() {
        return (
            <div style={{paddingLeft:8, maxWidth: 1500}}>
                The SIGNAL (<u>S</u>omatic <u>I</u>ntegration of <u>G</u>ermli<u>n</u>e <u>Al</u>terations in cancer)
                resource integrates germline and somatic alterations identified by clinical sequencing of
                active cancer patients. Provided here are pathogenic germline variants and their tumor-specific
                zygosity changes by gene, lineage, and cancer type in 17,152 prospectively sequenced cancer patients.
            </div>
        );
    }

    public render()
    {
        return (
            <div>
                {this.blurb}
                <hr />
                {!this.isLoading() &&
                    <Row className="mb-2">
                        <PenetranceFilterPanel
                            selectedPenetranceLevels={this.selectedPenetranceLevels}
                            geneFrequencyStore={this.props.frequencyStore}
                            onSelect={this.handlePenetranceSelect}
                        />
                    </Row>
                }
                <GeneLevelSummary
                    frequencyStore={this.props.frequencyStore}
                />
            </div>
        );
    }

    private isLoading(): boolean {
        return this.props.frequencyStore !== undefined && (
            this.props.frequencyStore.frequencySummaryDataStatus === "pending" ||
            this.props.frequencyStore.tumorTypeFrequenciesDataStatus === "pending"
        );
    }

    @action.bound
    private handlePenetranceSelect(penetrance: PenetranceLevel)
    {
        this.selectedPenetranceLevels = this.selectedPenetranceLevels.includes(penetrance) ?
            _.without(this.selectedPenetranceLevels, penetrance): [...this.selectedPenetranceLevels, penetrance];

        if (this.props.frequencyStore) {
            this.props.frequencyStore.geneFrequencySummaryPenetranceFilter = this.penetranceFilter;
        }
    }
}

export default Explore;

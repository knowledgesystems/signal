import {action, computed, observable} from "mobx";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";
import {DataStatus} from "./DataStatus";
import {fetchMutationFrequencyByGene} from "./DataUtils";

class MutationStore
{
    @observable
    public mutationFrequencyDataStatus: DataStatus = 'pending';

    public mutationFrequencyDataPromise: Promise<IAggregatedMutationFrequencyByGene[]>;

    @observable
    protected mutationFrequencyData: IAggregatedMutationFrequencyByGene[] = [];

    @observable
    private filterText: string|undefined;

    @computed
    public get filteredMutationFrequencyData(): IAggregatedMutationFrequencyByGene[]
    {
        let data: IAggregatedMutationFrequencyByGene[] = this.mutationFrequencyData;

        if (this.filterText !== undefined) {
            data = this.mutationFrequencyData.filter(
                m => m.hugoSymbol.toLocaleLowerCase().includes(this.filterText!.toLowerCase()));
        }

        return data;
    }

    constructor() {
        this.mutationFrequencyDataPromise = fetchMutationFrequencyByGene();

        this.mutationFrequencyDataPromise
            .then(data => {
                this.mutationFrequencyData = data;
                this.mutationFrequencyDataStatus = 'complete';
            })
            .catch(() => {
                this.mutationFrequencyData = [];
                this.mutationFrequencyDataStatus = 'error';
            });
    }

    @action
    public filterFrequenciesByGene(input: string) {
        this.filterText = input;
    }
}

export default MutationStore;

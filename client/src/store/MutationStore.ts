import {action, computed, observable} from "mobx";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";

class MutationStore
{
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
        fetch("/api/mutation/frequency/byGene")
            .then(response => response.json())
            .then(data => {
                this.mutationFrequencyData = data
            })
            .catch(() => {
                this.mutationFrequencyData = [];
            });
    }

    @action
    public filterFrequenciesByGene(input: string) {
        this.filterText = input;
    }
}

export default MutationStore;

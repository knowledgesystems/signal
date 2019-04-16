import {computed, observable} from "mobx";

import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";

class MutationStore
{
    @observable
    protected mutationFrequencyData: IAggregatedMutationFrequencyByGene[] = [];

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

    @computed get mutationFrequencies() {
        return this.mutationFrequencyData;
    }
}

export default MutationStore;

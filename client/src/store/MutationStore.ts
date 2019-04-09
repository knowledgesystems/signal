import {computed, observable} from "mobx";

class MutationStore
{
    @observable
    protected mutationData: any[] = []; // TODO: Mutation[]

    constructor() {
        fetch("/api/mutations")
            .then(response => response.json())
            .then(data => {
                this.mutationData = data
            })
            .catch(() => {
                this.mutationData = [];
            });
    }

    @computed get mutations() {
        return this.mutationData;
    }
}

export default MutationStore;

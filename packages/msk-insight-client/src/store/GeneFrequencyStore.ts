import {action, observable} from "mobx";
import {IGeneFrequencySummary} from "msk-insight-commons";

import {fetchFrequencySummaryByGene} from "../util/FrequencyDataUtils";
import {DataStatus} from "./DataStatus";

class GeneFrequencyStore
{
    @observable
    public geneFrequencyDataStatus: DataStatus = 'pending';

    public geneFrequencySummaryDataPromise: Promise<IGeneFrequencySummary[]>;

    @observable
    public mutationFrequencyData: IGeneFrequencySummary[] = [];

    @observable
    public filterText: string|undefined;

    constructor() {
        this.geneFrequencySummaryDataPromise = fetchFrequencySummaryByGene();

        this.geneFrequencySummaryDataPromise
            .then(data => {
                this.mutationFrequencyData = data;
                this.geneFrequencyDataStatus = 'complete';
            })
            .catch(() => {
                this.mutationFrequencyData = [];
                this.geneFrequencyDataStatus = 'error';
            });
    }

    @action
    public filterFrequenciesByGene(input: string) {
        this.filterText = input;
    }
}

export default GeneFrequencyStore;

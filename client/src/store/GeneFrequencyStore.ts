import {action, computed, observable} from "mobx";

import {IGeneFrequencySummary} from "../../../server/src/model/GeneFrequencySummary";
import {fetchFrequencySummaryByGene} from "../util/FrequencyDataUtils";
import {DataStatus} from "./DataStatus";

class GeneFrequencyStore
{
    @observable
    public geneFrequencyDataStatus: DataStatus = 'pending';

    public geneFrequencySummaryDataPromise: Promise<IGeneFrequencySummary[]>;

    @observable
    protected mutationFrequencyData: IGeneFrequencySummary[] = [];

    @observable
    private filterText: string|undefined;

    @computed
    public get filteredGeneFrequencySummaryData(): IGeneFrequencySummary[]
    {
        let data: IGeneFrequencySummary[] = this.mutationFrequencyData;

        if (this.filterText !== undefined) {
            data = this.mutationFrequencyData.filter(
                m => m.hugoSymbol.toLocaleLowerCase().includes(this.filterText!.toLowerCase()));
        }

        return data;
    }

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

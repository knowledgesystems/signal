import {
    IGeneFrequencySummary,
    ITumorTypeFrequencySummary,
    transformFrequencySummaryByGene,
    transformTumorTypeFrequenciesByGene
} from "msk-insight-commons";

import GeneSummaryRepository from "../repository/GeneSummaryRepository";

class GeneSummaryService
{
    private geneSummaryRepository: GeneSummaryRepository;

    private frequencySummaryByGene: IGeneFrequencySummary[];
    private tumorTypeFrequenciesByGene: ITumorTypeFrequencySummary[];

    constructor(geneSummaryRepository?: GeneSummaryRepository)
    {
        this.geneSummaryRepository = geneSummaryRepository || new GeneSummaryRepository(() => {
            // preload gene frequencies
            this.frequencySummaryByGene = this.getFrequencySummaryByGene();
            this.tumorTypeFrequenciesByGene = this.getAllTumorTypeFrequenciesByGene();
        });
    }

    public getFrequencySummaryByGene(): IGeneFrequencySummary[]
    {
        return this.frequencySummaryByGene || transformFrequencySummaryByGene(
            this.geneSummaryRepository.findFrequencySummaryByGene());
    }

    public getAllTumorTypeFrequenciesByGene(): ITumorTypeFrequencySummary[]
    {
        return this.tumorTypeFrequenciesByGene || transformTumorTypeFrequenciesByGene(
            this.geneSummaryRepository.findTumorTypeFrequenciesByGene());
    }

    public getTumorTypeFrequenciesByGene(hugoSymbol: string): ITumorTypeFrequencySummary[]
    {
        return this.getAllTumorTypeFrequenciesByGene().filter(f => f.hugoSymbol === hugoSymbol);
    }
}

export default GeneSummaryService;

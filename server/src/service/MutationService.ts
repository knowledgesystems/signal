import {IMutation, MutationCategory} from "../model/Mutation";
import {IAggregatedMutationFrequencyByGene} from "../model/MutationFrequency";
import MutationRepository from "../repository/MutationRepository";
import {
    calculateFrequenciesByGene,
    getMutationsByGene,
    overrideTumorTypeCounts
} from "../util/MutationUtils";

class MutationService
{
    private mutationRepository: MutationRepository;

    constructor(mutationRepository: MutationRepository = new MutationRepository()) {
        this.mutationRepository = mutationRepository;
    }

    public getMutationFrequenciesByGene(): IAggregatedMutationFrequencyByGene[]
    {
        return calculateFrequenciesByGene(this.getAllMutationsByGene());
    }

    public getAllMutationsByGene(): IMutation[]
    {
        return [
            ...this.getSomaticMutationsByGene(),
            ...this.getGermlineMutationsByGene(),
            ...this.getBiallelicGermlineMutationsByGene(),
            ...this.getGermlineQCPassMutationsByGene(),
            ...this.getBiallelicGermlineQCPassOverriddenMutationsByGene()
        ];
    }

    public getMutationsByGene(hugoSymbol?: string, category?: string, pathogenic?: boolean): IMutation[]
    {
        let mutations = this.getAllMutationsByGene();

        if (hugoSymbol) {
            mutations = mutations.filter(m => m.hugoSymbol === hugoSymbol);
        }

        if (category) {
            mutations = mutations.filter(m => m.category === category);
        }

        if (pathogenic) {
            mutations = mutations.filter(m => m.isPathogenic);
        }

        return mutations;
    }

    public getSomaticMutationsByGene(): IMutation[]
    {
        return getMutationsByGene(
            this.mutationRepository.findSomaticMutationsByGene(),
            MutationCategory.SOMATIC);
    }

    public getGermlineMutationsByGene(): IMutation[]
    {
        return getMutationsByGene(
            this.mutationRepository.findGermlineMutationsByGene(),
            MutationCategory.GERMLINE);
    }

    public getBiallelicGermlineMutationsByGene(): IMutation[]
    {
        return getMutationsByGene(
            this.mutationRepository.findBiallelicGermlineMutationsByGene(),
            MutationCategory.BIALLELIC_GERMLINE);
    }

    public getGermlineQCPassMutationsByGene(): IMutation[]
    {
        return getMutationsByGene(
            this.mutationRepository.findGermlineQCPassMutationsByGene(),
            MutationCategory.QC_GERMLINE);
    }

    public getBiallelicGermlineQCPassOverriddenMutationsByGene(): IMutation[]
    {
        return overrideTumorTypeCounts(
            this.getBiallelicGermlineMutationsByGene(),
            this.getGermlineQCPassMutationsByGene(),
            MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE);
    }
}

export default MutationService;

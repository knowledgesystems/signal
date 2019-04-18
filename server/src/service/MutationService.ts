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

    // TODO use mobx computed and observable if possible
    private somaticMutationsByGene: IMutation[] | undefined;
    private germlineMutationsByGene: IMutation[] | undefined;
    private biallelicGermlineMutationsByGene: IMutation[] | undefined;
    private germlineQCPassMutationsByGene: IMutation[] | undefined;
    private biallelicGermlineQCPassOverriddenMutationsByGene: IMutation[] | undefined;
    private allMutationsByGene: IMutation[] | undefined;

    constructor(mutationRepository?: MutationRepository)
    {
        this.mutationRepository = mutationRepository || new MutationRepository(() => {
            // precompute mutations by gene
            this.somaticMutationsByGene = this.getSomaticMutationsByGene();
            this.germlineMutationsByGene = this.getGermlineMutationsByGene();
            this.biallelicGermlineMutationsByGene = this.getBiallelicGermlineMutationsByGene();
            this.germlineQCPassMutationsByGene = this.getGermlineQCPassMutationsByGene();
            this.biallelicGermlineQCPassOverriddenMutationsByGene = this.getBiallelicGermlineQCPassOverriddenMutationsByGene();
            this.allMutationsByGene = this.getAllMutationsByGene();
        });
    }

    public getMutationFrequenciesByGene(): IAggregatedMutationFrequencyByGene[]
    {
        return calculateFrequenciesByGene(this.getAllMutationsByGene());
    }

    public getAllMutationsByGene(): IMutation[]
    {
        return this.allMutationsByGene || [
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
        return this.somaticMutationsByGene || getMutationsByGene(
            this.mutationRepository.findSomaticMutationsByGene(),
            MutationCategory.SOMATIC);
    }

    public getGermlineMutationsByGene(): IMutation[]
    {
        return this.germlineMutationsByGene || getMutationsByGene(
            this.mutationRepository.findGermlineMutationsByGene(),
            MutationCategory.GERMLINE);
    }

    public getBiallelicGermlineMutationsByGene(): IMutation[]
    {
        return this.biallelicGermlineMutationsByGene || getMutationsByGene(
            this.mutationRepository.findBiallelicGermlineMutationsByGene(),
            MutationCategory.BIALLELIC_GERMLINE);
    }

    public getGermlineQCPassMutationsByGene(): IMutation[]
    {
        return this.germlineQCPassMutationsByGene || getMutationsByGene(
            this.mutationRepository.findGermlineQCPassMutationsByGene(),
            MutationCategory.QC_GERMLINE);
    }

    public getBiallelicGermlineQCPassOverriddenMutationsByGene(): IMutation[]
    {
        return this.biallelicGermlineQCPassOverriddenMutationsByGene || overrideTumorTypeCounts(
            this.getBiallelicGermlineMutationsByGene(),
            this.getGermlineQCPassMutationsByGene(),
            MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE);
    }
}

export default MutationService;

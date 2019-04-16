import {ICountByCancerType, IMutation, MutationCategory} from "../model/Mutation";
import {IAggregatedMutationFrequencyByGene} from "../model/MutationFrequency";
import MutationRepository from "../repository/MutationRepository";
import {calculateFrequenciesByGene, getCountOrDefault, isPathogenic} from "../util/MutationUtils";

const VARIANT_COUNT_POSTFIX = "_variant_count";
const TUMOR_TYPE_COUNT_POSTFIX = "_tumortype_count";
const GENE_COUNT_POSTFIX = "_gene_count";

function getMutationsByGene(rows: any[], category?: MutationCategory): IMutation[]
{
    return rows.map(row => {
        const countByCancerType: ICountByCancerType = {};

        Object.keys(row).forEach(key => {
            let cancerType: string|undefined;

            if (key.endsWith(GENE_COUNT_POSTFIX)) {
                cancerType = key.replace(GENE_COUNT_POSTFIX ,"");
                getCountOrDefault(countByCancerType, cancerType).variantCount = Number(row[key]);
            }
            else if (key.endsWith((TUMOR_TYPE_COUNT_POSTFIX))) {
                cancerType = key.replace(TUMOR_TYPE_COUNT_POSTFIX ,"");
                getCountOrDefault(countByCancerType, cancerType).tumorTypeCount = Number(row[key]);
            }
        });

        return {
            category: category || MutationCategory.DEFAULT,
            hugoSymbol: row.Hugo_Symbol,
            isPathogenic: isPathogenic(row.classifier_pathogenic_final),
            penetrance: row.penetrance,
            countByCancerType
        };
    });
}

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
            ...this.getGermlineQCPassMutationsByGene()
        ];
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
}

export default MutationService;

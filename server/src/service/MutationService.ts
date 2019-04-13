import {ICountByCancerType, IMutationCount} from "../model/MutationCount";
import MutationRepository from "../repository/MutationRepository";

const VARIANT_COUNT_POSTFIX = "_variant_count";
const TUMOR_TYPE_COUNT_POSTFIX = "_tumortype_count";

function getCountOrDefault(countByCancerType: ICountByCancerType,
                           cancerType: string): {variantCount: number, tumorTypeCount: number}
{
    countByCancerType[cancerType] = countByCancerType[cancerType] || {variantCount: 0, tumorTypeCount: 0};
    return countByCancerType[cancerType];
}

function getCountByGene(rows: any[])
{
    return rows.map(row => {
        const countByCancerType: ICountByCancerType = {};

        Object.keys(row).forEach(key => {
            let cancerType: string|undefined;

            if (key.endsWith(VARIANT_COUNT_POSTFIX)) {
                cancerType = key.replace(VARIANT_COUNT_POSTFIX ,"");
                getCountOrDefault(countByCancerType, cancerType).variantCount = row[key];
            }
            else if (key.endsWith((TUMOR_TYPE_COUNT_POSTFIX))) {
                cancerType = key.replace(TUMOR_TYPE_COUNT_POSTFIX ,"");
                getCountOrDefault(countByCancerType, cancerType).tumorTypeCount = row[key];
            }
        });

        return {
            hugoSymbol: row.Hugo_Symbol,
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

    public getSomaticMutationCountByGene(): IMutationCount[]
    {
        return getCountByGene(this.mutationRepository.findSomaticMutationCountByGene());
    }

    public getPathogenicGermlineMutationCountByGene(): IMutationCount[]
    {
        return getCountByGene(this.mutationRepository.findPathogenicGermlineMutationCountByGene());
    }

    public getBiallelicPathogenicGermlineMutationCountByGene(): IMutationCount[]
    {
        return getCountByGene(this.mutationRepository.findBiallelicPathogenicGermlineMutationCountByGene());
    }
}

export default MutationService;

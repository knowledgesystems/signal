import _ from "lodash";

import {ICountByCancerType, IMutation, MutationCategory} from "../model/Mutation";
import {IAggregatedMutationFrequencyByGene, IMutationFrequencyByGene} from "../model/MutationFrequency";

const VARIANT_COUNT_POSTFIX = "_variant_count";
const TUMOR_TYPE_COUNT_POSTFIX = "_tumortype_count";
const GENE_COUNT_POSTFIX = "_gene_count";

export function isPathogenic(pathogenic: string): boolean|undefined
{
    if (pathogenic.trim() === "0") {
        return false;
    }
    else if (pathogenic.trim() === "1") {
        return true;
    }
    else {
        return undefined;
    }
}

export function getCountOrDefault(countByCancerType: ICountByCancerType,
                                  cancerType: string): {variantCount: number, tumorTypeCount: number}
{
    countByCancerType[cancerType] = countByCancerType[cancerType] || {variantCount: 0, tumorTypeCount: 0};
    return countByCancerType[cancerType];
}

export function getFrequencyOrDefault(frequencyMap: {[hugoSymbol: string]: IAggregatedMutationFrequencyByGene},
                                      hugoSymbol: string): IAggregatedMutationFrequencyByGene
{
    frequencyMap[hugoSymbol] = frequencyMap[hugoSymbol] || {
        hugoSymbol,
        frequencies: []
    };

    return frequencyMap[hugoSymbol];
}

export function calculateFrequenciesByGene(mutations: IMutation[]): IAggregatedMutationFrequencyByGene[]
{
    const groupedByCategory: {[category: string]: IMutation[]} = _.groupBy(mutations, "category");

    const somatic = calculateFrequencyByGene(groupedByCategory[MutationCategory.SOMATIC]);
    const germline = calculateFrequencyByGene(groupedByCategory[MutationCategory.GERMLINE]);
    const biallelic = calculateFrequencyByGene(groupedByCategory[MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE]);

    const frequencyMap: {[hugoSymbol: string]: IAggregatedMutationFrequencyByGene} = {};

    somatic.forEach(frequency => {
        getFrequencyOrDefault(frequencyMap, frequency.hugoSymbol).frequencies.push(
            {...frequency.frequency, category: MutationCategory.SOMATIC});
    });

    germline.forEach(frequency => {
        getFrequencyOrDefault(frequencyMap, frequency.hugoSymbol).frequencies.push(
            {...frequency.frequency, category: MutationCategory.GERMLINE});
    });

    biallelic.forEach(frequency => {
        getFrequencyOrDefault(frequencyMap, frequency.hugoSymbol).frequencies.push(
            {...frequency.frequency, category: MutationCategory.BIALLELIC_QC_OVERRIDDEN_GERMLINE});
    });

    return _.values(frequencyMap);
}

export function calculateFrequencyByGene(mutations: IMutation[]): IMutationFrequencyByGene[]
{
    const groupedByGene: {[hugoSymbol: string]: IMutation[]} = _.groupBy(mutations, "hugoSymbol");

    return _.keys(groupedByGene).map(hugoSymbol => {
        const mergedAllCounts = mergeMutationCounts(groupedByGene[hugoSymbol]);
        const mergedPathogenicCounts = mergeMutationCounts(
            groupedByGene[hugoSymbol].filter(mutation => mutation.isPathogenic));

        const mergedAllCountsTotal: {variantCount: number, tumorTypeCount: number} =
            sumToSingleCount(mergedAllCounts);
        const mergedPathogenicCountsTotal: {variantCount: number, tumorTypeCount: number} =
            sumToSingleCount(mergedPathogenicCounts);

        return {
            frequency: {
                all: mergedAllCountsTotal.variantCount / mergedAllCountsTotal.tumorTypeCount,
                pathogenic: (mergedPathogenicCountsTotal.variantCount / mergedPathogenicCountsTotal.tumorTypeCount) || 0
            },
            hugoSymbol
        };
    });
}

export function mergeMutationCounts(mutations: IMutation[]): ICountByCancerType
{
    const countByCancerType: ICountByCancerType = {};

    mutations.map(mutation => mutation.countByCancerType).forEach(count => {
        _.keys(count).forEach(cancerType => {
            const mergedCount = getCountOrDefault(countByCancerType, cancerType);
            mergedCount.tumorTypeCount = count[cancerType].tumorTypeCount;
            mergedCount.variantCount += count[cancerType].variantCount;
        });
    });

    return countByCancerType;
}

export function sumToSingleCount(count: ICountByCancerType)
{
    return _.reduce(_.values(count),
        (acc: {variantCount: number, tumorTypeCount: number},
         curr: {variantCount: number, tumorTypeCount: number}) => ({
            variantCount: acc.variantCount + curr.variantCount,
            tumorTypeCount: acc.tumorTypeCount + curr.tumorTypeCount
         })
        , {variantCount: 0, tumorTypeCount: 0});
}

export function getMutationsByGene(rows: any[], category?: MutationCategory): IMutation[]
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


export function overrideTumorTypeCounts(overrideTargetMutations: IMutation[],
                                        overrideSourceMutations: IMutation[],
                                        category?: MutationCategory): IMutation[]
{
    const sourceGroupedByGene: {[hugoSymbol: string]: IMutation[]} = _.groupBy(overrideSourceMutations, "hugoSymbol");

    return overrideTargetMutations.map(m => {
        const sourceMutations = sourceGroupedByGene[m.hugoSymbol];
        const overriddenCountByCancerType: ICountByCancerType = {};

        _.keys(m.countByCancerType).forEach((cancerType: string) => {
            overriddenCountByCancerType[cancerType] = {
                variantCount: m.countByCancerType[cancerType].variantCount,
                // try to override tumor type counts from the source
                tumorTypeCount: sourceMutations.length > 0 && sourceMutations[0].countByCancerType[cancerType] ?
                    sourceMutations[0].countByCancerType[cancerType].tumorTypeCount :
                    m.countByCancerType[cancerType].tumorTypeCount
            }
        });

        return {
            category,
            hugoSymbol: m.hugoSymbol,
            isPathogenic: m.isPathogenic,
            penetrance: m.penetrance,
            countByCancerType: overriddenCountByCancerType
        };
    });
}

import _ from "lodash";

import {ICountByCancerType, IMutation, MutationCategory} from "../model/Mutation";
import {IMutationFrequencyByGene} from "../model/MutationFrequency";

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

export function calculateFrequenciesByGene(mutations: IMutation[]) {
    const groupedByCategory: {[category: string]: IMutation[]} = _.groupBy(mutations, "category");

    const somatic = calculateFrequencyByGene(groupedByCategory[MutationCategory.SOMATIC]);
    const germline = calculateFrequencyByGene(groupedByCategory[MutationCategory.GERMLINE]);
    const biallelic = calculateFrequencyByGene(
        groupedByCategory[MutationCategory.BIALLELIC_GERMLINE],
        groupedByCategory[MutationCategory.QC_GERMLINE]);

    return {
        [MutationCategory.SOMATIC]: somatic,
        [MutationCategory.GERMLINE]: germline,
        [MutationCategory.BIALLELIC_GERMLINE]: biallelic
    };
}

export function calculateFrequencyByGene(mutations: IMutation[], qcMutations?: IMutation[]): IMutationFrequencyByGene[]
{
    const groupedByGene: {[hugoSymbol: string]: IMutation[]} = _.groupBy(mutations, "hugoSymbol");
    const qcGroupedByGene: {[hugoSymbol: string]: IMutation[]} | undefined =
        qcMutations ? _.groupBy(qcMutations, "hugoSymbol") : undefined;

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

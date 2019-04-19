import _ from 'lodash';

import {ICountByCancerType, IMutation, MutationCategory} from "../../../server/src/model/Mutation";
import {IAggregatedMutationFrequencyByGene} from "../../../server/src/model/MutationFrequency";


interface ICountsByCancerTypeWithCategory {
    [cancerType: string]: Array<{
        category: MutationCategory;
        tumorTypeCount: number;
        variantCount: number;
    }>
}

export function fetchMutationsByGeneAndCategory(hugoSymbol: string,
                                                category?: MutationCategory,
                                                pathogenic?: boolean): Promise<IMutation[]>
{
    return new Promise<IMutation[]>((resolve, reject) => {
        fetch(`/api/mutation/count/byGene?hugoSymbol=${hugoSymbol}&category=${category}&pathogenic=${pathogenic}`)
            .then(response => resolve(response.json()))
            .catch(err => reject(err));
    });
}

export function fetchMutationsByGeneAndCategories(hugoSymbol: string,
                                                  query: Array<{category?: MutationCategory, pathogenic?: boolean}>): Promise<IMutation[]>
{
    return new Promise<IMutation[]>((resolve, reject) => {
        const promises: Array<Promise<IMutation[]>> = query.map(
            q => fetchMutationsByGeneAndCategory(hugoSymbol, q.category, q.pathogenic));

        Promise.all(promises)
            .then(values => resolve(_.flatten(values)))
            .catch(err => reject(err));
    });
}

export function fetchMutationFrequencyByGene(): Promise<IAggregatedMutationFrequencyByGene[]> {
    return new Promise<IAggregatedMutationFrequencyByGene[]>((resolve, reject) => {
        fetch("/api/mutation/frequency/byGene")
            .then(response => resolve(response.json()))
            .catch(err => reject(err));
    });
}

export function extractTumorTypeFrequencyData(mutations: IMutation[])
{
    return mutations.map(m => tumorTypeCountMapToList(m.countByCancerType));
}

// TODO move complicated logic to server side?

export function tumorTypeCountMapToList(countMap: ICountByCancerType) {
    return _.toPairs(countMap).map(pair => ({
        cancerType: pair[0],
        tumorTypeCount: pair[1].tumorTypeCount,
        variantCount: pair[1].variantCount
    }));
}

export function extractAggregatedTumorTypeFrequencyData(mutations: IMutation[])
{
    const groupedByCategory = _.groupBy(mutations, "category");
    const countsGroupedByCategory: ICountsByCancerTypeWithCategory = {};

    _.keys(groupedByCategory).forEach(category => {
        const mergedCounts: ICountByCancerType = mergeMutationCounts(groupedByCategory[category]);

        _.keys(mergedCounts).forEach(cancerType => {
            countsGroupedByCategory[cancerType] = countsGroupedByCategory[cancerType] || [];
            countsGroupedByCategory[cancerType].push({
                category: category as MutationCategory,
                tumorTypeCount: mergedCounts[cancerType].tumorTypeCount,
                variantCount: mergedCounts[cancerType].variantCount
            });
        });
    });

    return _.toPairs(countsGroupedByCategory).map(pair => ({
        cancerType: pair[0],
        counts: pair[1]
    }));
}

// TODO #DUPLICATE server side code#: remove after resolving import issues: "Relative imports outside of src/ are not supported."

export function getCountOrDefault(countByCancerType: ICountByCancerType,
                                  cancerType: string): {variantCount: number, tumorTypeCount: number}
{
    countByCancerType[cancerType] = countByCancerType[cancerType] || {variantCount: 0, tumorTypeCount: 0};
    return countByCancerType[cancerType];
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

// TODO #end DUPLICATE#

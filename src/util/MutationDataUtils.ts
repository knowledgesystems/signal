import { CountByTumorType, GenomeNexusAPIInternal, SignalMutation } from 'genome-nexus-ts-api-client';
import _ from "lodash";
import {CancerTypeFilter} from "react-mutation-mapper";

import {
    calculateOverallFrequency,
    extendMutations,
    IExtendedSignalMutation,
    isGermlineMutation,
    ISignalTumorTypeDecomposition,
    SignalMutationStatus
} from "cbioportal-utils";
import {getGenomeNexusInternalClient} from "./ApiClientUtils";
import {
    applyMutationStatusFilter,
    containsCancerType,
    matchesMutationStatus,
    MutationStatusFilter
} from "./FilterUtils";

export function findAllUniqueCancerTypes(mutations: Array<Partial<SignalMutation>>)
{
    return _.uniq(_.flatten(mutations.map(m => (m.countsByTumorType || []).map(c => c.tumorType))));
}

export function fetchMutationsByGene(
    hugoGeneSymbol: string,
    client: GenomeNexusAPIInternal = getGenomeNexusInternalClient()
): Promise<SignalMutation[]>
{
    return new Promise<SignalMutation[]>((resolve, reject) =>
        client.fetchSignalMutationsByHugoSymbolGETUsingGET({hugoGeneSymbol})
            .then(response => resolve(response))
            .catch(err => reject(err))
    );
}

export function fetchExtendedMutationsByGene(hugoSymbol: string): Promise<IExtendedSignalMutation[]>
{
    return new Promise<IExtendedSignalMutation[]>((resolve, reject) => {
        fetchMutationsByGene(hugoSymbol)
            .then(mutations => resolve(extendMutations(mutations)))
            .catch(err => reject(err));
    });
}

export function calculateTotalFrequency(mutations: IExtendedSignalMutation[],
                                        mutationStatusFilter: MutationStatusFilter,
                                        cancerTypeFilter?: CancerTypeFilter)
{
    let frequency = null;
    const filtered = mutations.filter(mutation => applyMutationStatusFilter(mutationStatusFilter, mutation));

    if (filtered.length > 0) {
        const variantCount = totalFilteredVariants(filtered, cancerTypeFilter);
        const sampleCount = totalFilteredSamples(filtered, cancerTypeFilter);

        frequency = variantCount / sampleCount;
    }

    return frequency;
}

export function calculateTotalBiallelicRatio(mutations: IExtendedSignalMutation[],
                                             pathogenicGermlineFilter: MutationStatusFilter,
                                             biallelicPathogenicGermlineFilter: MutationStatusFilter,
                                             cancerTypeFilter?: CancerTypeFilter)
{
    let ratio = null;

    const pathogenicGermlineMutations = mutations.filter(
        mutation => applyMutationStatusFilter(pathogenicGermlineFilter, mutation));
    const biallelicPathogenicGermlineMutations = mutations.filter(
        mutation => applyMutationStatusFilter(biallelicPathogenicGermlineFilter, mutation));

    if (pathogenicGermlineMutations.length > 0 && biallelicPathogenicGermlineMutations.length > 0) {
        const combinedBiallelicCounts = combinedBiallelicCountsByTumorType(
            biallelicPathogenicGermlineMutations, cancerTypeFilter);
        const combinedQcPassCounts = combinedQcPassCountsByTumorType(
            pathogenicGermlineMutations, cancerTypeFilter);

        ratio = totalVariants(combinedBiallelicCounts) / totalVariants(combinedQcPassCounts);
    }

    return ratio;
}

function combinedBiallelicCountsByTumorType(mutations: IExtendedSignalMutation[], cancerTypeFilter?: CancerTypeFilter)
{
    return combinedCounts(mutations,
        (mutation: IExtendedSignalMutation) => mutation.biallelicCountsByTumorType,
        cancerTypeFilter);
}

function combinedQcPassCountsByTumorType(mutations: IExtendedSignalMutation[], cancerTypeFilter?: CancerTypeFilter)
{
    return combinedCounts(mutations,
        (mutation: IExtendedSignalMutation) => mutation.qcPassCountsByTumorType,
        cancerTypeFilter);
}

function combinedTumorTypeDecompositions(mutations: IExtendedSignalMutation[], cancerTypeFilter?: CancerTypeFilter)
{
    return combinedCounts(mutations,
        (mutation: IExtendedSignalMutation) => mutation.tumorTypeDecomposition,
        cancerTypeFilter);
}

function combinedCounts(mutations: IExtendedSignalMutation[],
                        getCounts: (mutation: IExtendedSignalMutation) => CountByTumorType[] | undefined,
                        cancerTypeFilter?: CancerTypeFilter)
{
    return _.flatten(mutations.map(mutation =>
        filterCountsByTumorType(getCounts(mutation), cancerTypeFilter)));
}

function filterCountsByTumorType(counts?: CountByTumorType[], cancerTypeFilter?: CancerTypeFilter)
{
    return counts ? counts.filter(c => containsCancerType(cancerTypeFilter, c.tumorType)) : [];
}

// TODO duplicate of https://bit.ly/3qQ13V5
function totalVariants(counts: CountByTumorType[]) {
    return counts.map(c => c.variantCount).reduce((acc, curr) => acc + curr, 0) || 0;
}

// TODO duplicate of https://bit.ly/3qGXeBi
function totalSamples(counts: CountByTumorType[]) {
    return counts.map(c => c.tumorTypeCount).reduce((acc, curr) => acc + curr, 0) || 0;
}

export function totalFilteredVariants(mutations: IExtendedSignalMutation[], cancerTypeFilter?: CancerTypeFilter) {
    return totalVariants(
        combinedTumorTypeDecompositions(mutations, cancerTypeFilter)
    );
}

export function totalFilteredSamples(mutations: IExtendedSignalMutation[], cancerTypeFilter?: CancerTypeFilter) {
    return mutations.length > 0 ? totalSamples(
        filterCountsByTumorType(mutations[0].tumorTypeDecomposition, cancerTypeFilter)
    ): 0;
}

export function calculateMutationRate(mutation: IExtendedSignalMutation,
                                      cancerTypeFilter?: CancerTypeFilter,
                                      mutationStatusFilter?: MutationStatusFilter)
{
    let frequency = 0;

    // if the only active germline filter is biallelic pathogenic germline,
    // then we need to use biallelic counts instead of overall tumor type count
    if (isGermlineMutation(mutation) &&
        containsOnlyBiallelicGermlineFilterValue(mutationStatusFilter))
    {
        const filteredBiallelicTumorTypeCount = mutation.biallelicCountsByTumorType.filter(
            t => containsCancerType(cancerTypeFilter, t.tumorType)
        );

        frequency = calculateOverallFrequency(filteredBiallelicTumorTypeCount);
    }
    else
    {
        const filteredTumorTypeDecomposition = mutation.tumorTypeDecomposition.filter(
            t => containsCancerType(cancerTypeFilter, t.tumorType) &&
                matchesMutationStatus(mutationStatusFilter, mutation, t)
        );

        frequency = calculateOverallFrequency(filteredTumorTypeDecomposition);
    }

    return 100 * frequency;
}

export function getVariantCount(mutation: IExtendedSignalMutation,
                                tumorTypeDecomposition: ISignalTumorTypeDecomposition,
                                cancerTypeFilter?: CancerTypeFilter,
                                mutationStatusFilter?: MutationStatusFilter)
{
    let count = 0;

    if (containsCancerType(cancerTypeFilter, tumorTypeDecomposition.tumorType) &&
        matchesMutationStatus(mutationStatusFilter, mutation, tumorTypeDecomposition))
    {
        // if the only active germline filter is biallelic pathogenic germline,
        // then we need to use biallelic variant count instead of variant count
        if (isGermlineMutation(mutation) &&
            containsOnlyBiallelicGermlineFilterValue(mutationStatusFilter))
        {
            count = tumorTypeDecomposition.biallelicVariantCount;
        }
        else {
            count = tumorTypeDecomposition.variantCount;
        }
    }

    return count;
}

function containsOnlyBiallelicGermlineFilterValue(mutationStatusFilter?: MutationStatusFilter)
{
    return (
        mutationStatusFilter &&
        _.every(mutationStatusFilter.values,
                v => v === SignalMutationStatus.BIALLELIC_PATHOGENIC_GERMLINE ||
                    v === SignalMutationStatus.SOMATIC)
    );
}

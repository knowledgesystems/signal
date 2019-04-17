import {MutationCategory} from "./Mutation";

export interface IMutationFrequency {
    all: number;
    pathogenic: number;
    category?: MutationCategory;
}

export interface IMutationFrequencyByGene
{
    hugoSymbol: string;
    frequency: IMutationFrequency;
}

export interface IAggregatedMutationFrequencyByGene {
    hugoSymbol: string;
    frequencies: IMutationFrequency[];
}

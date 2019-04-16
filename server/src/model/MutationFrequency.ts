export interface IMutationFrequency {
    all: number;
    pathogenic: number;
}

export interface IMutationFrequencyByGene
{
    hugoSymbol: string;
    frequency: IMutationFrequency;
}

export interface IAggregatedMutationFrequencyByGene {
    hugoSymbol: string;
    somaticFrequency: IMutationFrequency;
    germlineFrequency: IMutationFrequency;
    biallelicFrequency: IMutationFrequency;
}

export interface IMutationFrequency {
    all: number;
    pathogenic: number;
}

export interface IMutationFrequencyByGene
{
    hugoSymbol: string;
    frequency: IMutationFrequency;
}

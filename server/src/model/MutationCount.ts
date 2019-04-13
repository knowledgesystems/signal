export interface IMutationCount
{
    hugoSymbol: string;
    countByCancerType: ICountByCancerType;
}

export interface ICountByCancerType {
    [cancerType: string] : {variantCount: number, tumorTypeCount: number}
}

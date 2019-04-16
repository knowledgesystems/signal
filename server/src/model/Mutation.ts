export interface IMutation
{
    hugoSymbol: string;
    isPathogenic: boolean|undefined;
    penetrance: string;
    category: MutationCategory;
    countByCancerType: ICountByCancerType;
}

export interface ICountByCancerType {
    [cancerType: string] : {variantCount: number, tumorTypeCount: number}
}

export enum MutationCategory {
    DEFAULT = "NA",
    SOMATIC = "somaticByGene",
    GERMLINE = "germlineByGene",
    BIALLELIC_GERMLINE = "biallelicGermlineByGene",
    QC_GERMLINE = "qcGermlineByGene"
}

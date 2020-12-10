import {
    ISignalGeneFrequencySummary,
    ISignalTumorTypeFrequencySummary,
    SignalFrequencySummaryCategory
} from "cbioportal-utils";

export function transformFrequencySummaryByGene(frequencySummaryByGene: any[]): ISignalGeneFrequencySummary[]
{
    return frequencySummaryByGene.map(summary => ({
        hugoSymbol: summary.Hugo_Symbol,
        penetrance: summary.penetrance.split(","),
        sampleCount: Number(summary.num_samples),
        frequencies: extractFrequencies(summary)
    }));
}

export function transformTumorTypeFrequenciesByGene(tumorTypeFrequenciesByGene: any[]): ISignalTumorTypeFrequencySummary[]
{
    return tumorTypeFrequenciesByGene.map(summary => ({
        tumorType: summary.Proposed_level,
        hugoSymbol: summary.Hugo_Symbol,
        penetrance: summary.penetrance.split(","),
        sampleCount: Number(summary.num_samples),
        frequencies: extractFrequencies(summary)
    }));
}

export function extractFrequencies(summary: any)
{
    return [
        {
            category: SignalFrequencySummaryCategory.SOMATIC_DRIVER,
            frequency: Number(summary.somatic_driver_rate)
        },
        {
            category: SignalFrequencySummaryCategory.PATHOGENIC_GERMLINE,
            frequency: Number(summary.pathogenic_germline_rate)
        },
        {
            category: SignalFrequencySummaryCategory.PERCENT_BIALLELIC,
            frequency: Number(summary.percent_biallelic)
        },
    ];
}
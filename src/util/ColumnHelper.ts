import {ISignalGeneFrequencySummary, SignalFrequencySummaryCategory} from "cbioportal-utils";

export function somaticAccessor(frequencySummary: ISignalGeneFrequencySummary) {
    const somaticFrequencies = frequencySummary.frequencies.filter(
        f => f.category === SignalFrequencySummaryCategory.SOMATIC_DRIVER);

    return somaticFrequencies.length > 0 ? somaticFrequencies[0].frequency : null;
}

export function germlineAccessor(frequencySummary: ISignalGeneFrequencySummary) {
    const germlineFrequencies = frequencySummary.frequencies.filter(
        f => f.category === SignalFrequencySummaryCategory.PATHOGENIC_GERMLINE);

    return germlineFrequencies.length > 0 ? germlineFrequencies[0].frequency : null;
}

export function biallelicAccessor(frequencySummary: ISignalGeneFrequencySummary) {
    const biallelicFrequencies = frequencySummary.frequencies.filter(
        f => f.category === SignalFrequencySummaryCategory.PERCENT_BIALLELIC);

    return biallelicFrequencies.length > 0 ? biallelicFrequencies[0].frequency : null;
}

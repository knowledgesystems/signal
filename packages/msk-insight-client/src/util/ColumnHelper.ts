import {FrequencySummaryCategory, IGeneFrequencySummary} from "msk-insight-commons";

export function somaticAccessor(frequencySummary: IGeneFrequencySummary) {
    const somaticFrequencies = frequencySummary.frequencies.filter(
        f => f.category === FrequencySummaryCategory.SOMATIC_DRIVER);

    return somaticFrequencies.length > 0 ? somaticFrequencies[0].frequency : null;
}

export function germlineAccessor(frequencySummary: IGeneFrequencySummary) {
    const germlineFrequencies = frequencySummary.frequencies.filter(
        f => f.category === FrequencySummaryCategory.PATHOGENIC_GERMLINE);

    return germlineFrequencies.length > 0 ? germlineFrequencies[0].frequency : null;
}

export function biallelicAccessor(frequencySummary: IGeneFrequencySummary) {
    const biallelicFrequencies = frequencySummary.frequencies.filter(
        f => f.category === FrequencySummaryCategory.PERCENT_BIALLELIC);

    return biallelicFrequencies.length > 0 ? biallelicFrequencies[0].frequency : null;
}

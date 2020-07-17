import {scaleLinear} from "d3-scale";
import {interpolateYlOrBr} from "d3-scale-chromatic";

import {comparePenetrance, STYLE_MAP as PENETRANCE_STYLE_MAP} from "../components/Penetrance";
import {
    FrequencySummaryCategory,
    IGeneFrequencySummary,
    ITumorTypeFrequencySummary
} from "../model/GeneFrequencySummary";

export interface IScatterPlotDatum {
    x: string;
    y: string;
    datum: ITumorTypeFrequencySummary;
}

// TODO this should be applied to the gene, not to a single data point
export function getPenetranceColor(d: IScatterPlotDatum) {
    const sortedPenetrance = d.datum.penetrance.sort(comparePenetrance);
    const penetrance = sortedPenetrance.length > 0 ? sortedPenetrance[0]: undefined;
    const penetranceStyle = penetrance ? PENETRANCE_STYLE_MAP[penetrance]: PENETRANCE_STYLE_MAP.Uncertain;

    return penetranceStyle.color;
}

export function findPathogenicGermlineFrequency(d?: IGeneFrequencySummary)
{
    return d ? d.frequencies.find(
        f => f.category === FrequencySummaryCategory.PATHOGENIC_GERMLINE
    ): undefined;
}

export function findPercentBiallelic(d?: IGeneFrequencySummary)
{
    return d ? d.frequencies.find(
        f => f.category === FrequencySummaryCategory.PERCENT_BIALLELIC
    ): undefined;
}

export function dataPointFill(d: IScatterPlotDatum)
{
    const percentBiallelic = d.datum.frequencies.find(
        f => f.category === FrequencySummaryCategory.PERCENT_BIALLELIC
    );

    const scaleFn = scaleLinear().domain([0, 1]).range([0.25, 1]);

    return interpolateYlOrBr(scaleFn(percentBiallelic ? percentBiallelic.frequency || 0: 0));
}

export function dataPointSize(d: IScatterPlotDatum)
{
    const pathogenicGermline = findPathogenicGermlineFrequency(d.datum);

    const percent = (pathogenicGermline ? pathogenicGermline.frequency: 0) * 100;

    let size: number;

    // custom scale
    if (percent > 20) {
        size = 8;
    }
    else if (percent > 10) {
        size = 7;
    }
    else if (percent > 5) {
        size = 6;
    }
    else if (percent > 2) {
        size = 5;
    }
    else if (percent > 1) {
        size = 4;
    }
    else if (percent > 0.5) {
        size = 3;
    }
    else {
        size = 2;
    }

    return size;
}

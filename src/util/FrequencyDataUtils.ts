import {ISignalGeneFrequencySummary, ISignalTumorTypeFrequencySummary} from "cbioportal-utils";
import {
    transformFrequencySummaryByGene,
    transformTumorTypeFrequenciesByGene
} from "./FrequencySummaryUtils";
import {readAsJson} from "./ParseUtils";

export function fetchTumorTypeFrequencySummaryByGene(): Promise<ISignalTumorTypeFrequencySummary[]> {
    return new Promise<ISignalTumorTypeFrequencySummary[]>((resolve, reject) => {
        fetch("/data/signal.cancertype_specific_somatic_germline_stats.txt")
            .then(response => response.text())
            .then(text => readAsJson(text))
            .then(json => resolve(transformTumorTypeFrequenciesByGene(json)))
            .catch(err => reject(err));
    });
}

export function fetchFrequencySummaryByGene(): Promise<ISignalGeneFrequencySummary[]> {
    return new Promise<ISignalGeneFrequencySummary[]>((resolve, reject) => {
        fetch("/data/signal.pancancer_somatic_germline_stats.txt")
            .then(response => response.text())
            .then(text => readAsJson(text))
            .then(json => resolve(transformFrequencySummaryByGene(json)))
            .catch(err => reject(err));
    });
}

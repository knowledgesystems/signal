import path from "path";
import {readAsJson} from "../util/IOUtils";

class GeneSummaryRepository
{
    private frequencySummaryByGene: any[];
    private tumorTypeFrequenciesByGene: any[];

    constructor(onReady?: () => void)
    {
        const frequencySummaryByGenePath = path.join(__dirname, "../resources/data/insight.pancancer_somatic_germline_stats.txt");
        const tumorTypeFrequenciesByGenePath = path.join(__dirname, "../resources/data/insight.cancertype_specific_somatic_germline_stats.txt");

        const promises = [
            readAsJson(frequencySummaryByGenePath).then(
                json => this.frequencySummaryByGene = json),
            readAsJson(tumorTypeFrequenciesByGenePath).then(
                json => this.tumorTypeFrequenciesByGene = json),
        ];

        if (onReady) {
            Promise.all(promises).then(() => onReady());
        }
    }

    public findFrequencySummaryByGene(): any[] {
        return(this.frequencySummaryByGene);
    }

    public findTumorTypeFrequenciesByGene(): any[] {
        return(this.tumorTypeFrequenciesByGene);
    }
}

export default GeneSummaryRepository;

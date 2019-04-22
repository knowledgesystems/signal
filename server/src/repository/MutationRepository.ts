import path from "path";
import {readAsJson} from "../util/IOUtils";

class MutationRepository
{
    private somaticMutationCountByGene: any[];
    private germlineMutationCountByGene: any[];
    private biallelicGermlineMutationCountByGene: any[];
    private germlineQCPassMutationCountByGene: any[];

    constructor(onReady?: () => void)
    {
        // const mutationsFilePath = path.join(__dirname, "../resources/data/mutations_by_tumortype_merge.txt");
        const somaticMutationCountByGenePath = path.join(__dirname, "../resources/data/somatic_genelevel_summary.txt");
        const germlineMutationCountByGenePath = path.join(__dirname, "../resources/data/gene_by_tumortype_merge.txt");
        const biallelicGermlineMutationByGenePath = path.join(__dirname, "../resources/data/gene_biallelic_by_tumortype_merge.txt");
        const germlineQCPassMutationCountByGenePath = path.join(__dirname, "../resources/data/gene_QCpass_by_tumortype_merge.txt");

        const promises = [
            readAsJson(somaticMutationCountByGenePath).then(
                json => this.somaticMutationCountByGene = json),
            readAsJson(germlineMutationCountByGenePath).then(
                json => this.germlineMutationCountByGene = json),
            readAsJson(biallelicGermlineMutationByGenePath).then(
                json => this.biallelicGermlineMutationCountByGene = json),
            readAsJson(germlineQCPassMutationCountByGenePath).then(
                json => this.germlineQCPassMutationCountByGene = json)
        ];

        if (onReady) {
            Promise.all(promises).then(() => onReady());
        }
    }

    public findSomaticMutationsByGene(): any[] {
        return(this.somaticMutationCountByGene);
    }

    public findGermlineMutationsByGene(): any[] {
        return(this.germlineMutationCountByGene);
    }

    public findBiallelicGermlineMutationsByGene(): any[] {
        return(this.biallelicGermlineMutationCountByGene);
    }

    public findGermlineQCPassMutationsByGene(): any[] {
        return(this.germlineQCPassMutationCountByGene);
    }

}

export default MutationRepository;

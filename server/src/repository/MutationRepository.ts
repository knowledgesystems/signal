import csvToJson from "csvtojson";
import {Converter} from "csvtojson/v2/Converter";
import path from "path";

function readCounts(filePath: string): Converter
{
    return csvToJson({delimiter: "\t"}).fromFile(filePath);
}

class MutationRepository
{
    private somaticMutationCountByGene: any[];
    private pathogenicGermlineMutationCountByGene: any[];
    private biallelicPathogenicGermlineMutationCountByGene: any[];

    constructor()
    {
        // const mutationsFilePath = path.join(__dirname, "../resources/data/mutations_by_tumortype_merge.txt");
        const somaticMutationCountByGenePath = path.join(__dirname, "../resources/data/somatic_mutation_count_by_gene.txt");
        const pathogenicGermlineMutationCountByGenePath = path.join(__dirname, "../resources/data/pathogenic_germline_mutation_count_by_gene.txt");
        const biallelicPathogenicGermlineMutationByGene = path.join(__dirname, "../resources/data/biallelic_pathogenic_germline_mutation_count_by_gene.txt");

        readCounts(somaticMutationCountByGenePath).then(json => this.somaticMutationCountByGene = json);
        readCounts(pathogenicGermlineMutationCountByGenePath).then(json => this.pathogenicGermlineMutationCountByGene = json);
        readCounts(biallelicPathogenicGermlineMutationByGene).then(json => this.biallelicPathogenicGermlineMutationCountByGene = json);
    }

    public findSomaticMutationCountByGene(): any[] {
        return(this.somaticMutationCountByGene);
    }

    public findPathogenicGermlineMutationCountByGene(): any[] {
        return(this.pathogenicGermlineMutationCountByGene);
    }

    public findBiallelicPathogenicGermlineMutationCountByGene(): any[] {
        return(this.biallelicPathogenicGermlineMutationCountByGene);
    }
}

export default MutationRepository;

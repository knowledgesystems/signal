import csvToJson from "csvtojson";
import path from "path";

class MutationRepository
{
    private mutations: any[]; // all mutations TODO Mutation[]

    constructor() {
        const mutationsFilePath = path.join(__dirname, "../resources/data/mutations_by_tumortype_merge.txt");

        csvToJson({delimiter: "\t"})
            .fromFile(mutationsFilePath)
            .then(json => {
                this.mutations = json;
            });
    }

    public findAllMutations(): any[] // TODO Mutation[]
    {
        return(this.mutations);
    }
}

export default MutationRepository;

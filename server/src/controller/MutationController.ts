import autobind from "autobind-decorator";
import {Express} from "express";
import {Request, Response} from "express-serve-static-core";

import MutationService from "../service/MutationService";

class MutationController
{
    private mutationService: MutationService;

    constructor(app: Express,
                mutationService: MutationService = new MutationService())
    {
        // configure endpoints
        app.get("/api/mutation/count/byGene", this.fetchMutationsByGeneGET);
        app.get("/api/mutation/frequency/byGene", this.fetchMutationFrequenciesByGeneGET);

        // init services
        this.mutationService = mutationService;
    }

    @autobind
    private fetchMutationsByGeneGET(req: Request, res: Response) {
        res.send(this.mutationService.getAllMutationsByGene());
    }

    @autobind
    private fetchMutationFrequenciesByGeneGET(req: Request, res: Response) {
        res.send(this.mutationService.getMutationFrequenciesByGene());
    }
}

export default MutationController;

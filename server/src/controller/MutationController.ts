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
        app.get("/api/mutation/count/byGene", this.fetchMutationCountsByGeneGET);
        app.get("/api/mutation/frequency/byGene", this.fetchMutationFrequenciesByGeneGET);

        // init services
        this.mutationService = mutationService;
    }

    @autobind
    private fetchMutationCountsByGeneGET(req: Request, res: Response) {
        const hugoSymbol = req.query.hugoSymbol;
        const category = req.query.category;
        const pathogenic = req.query.pathogenic === "true";

        if (hugoSymbol || category || pathogenic) {
            res.send(this.mutationService.getMutationsByGene(hugoSymbol, category, pathogenic));
        }
        else {
            res.send(this.mutationService.getAllMutationsByGene());
        }
    }

    @autobind
    private fetchMutationFrequenciesByGeneGET(req: Request, res: Response) {
        res.send(this.mutationService.getMutationFrequenciesByGene());
    }
}

export default MutationController;

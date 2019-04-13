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
        app.get("/api/mutation/counts/byGene", this.fetchMutationCountsByGeneGET);

        // init services
        this.mutationService = mutationService;
    }

    @autobind
    private fetchMutationCountsByGeneGET(req: Request, res: Response) {
        const counts = {
            somatic: this.mutationService.getSomaticMutationCountByGene(),
            pathogenicGermline: this.mutationService.getPathogenicGermlineMutationCountByGene(),
            biallelicPathogenicGermline: this.mutationService.getBiallelicPathogenicGermlineMutationCountByGene()
        };

        res.send(counts);
    }
}

export default MutationController;

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
        app.get("/api/mutations", this.fetchMutationsGET);

        // init services
        this.mutationService = mutationService;
    }

    @autobind
    private fetchMutationsGET(req: Request, res: Response) {
        res.send(this.mutationService.getAllMutations());
    }
}

export default MutationController;

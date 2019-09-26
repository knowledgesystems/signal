import autobind from "autobind-decorator";
import {Express, NextFunction} from "express";
import {Request, Response} from "express-serve-static-core";

import GenomeNexusService from "../service/GenomeNexusService";

class MutationController
{
    private genomeNexusService: GenomeNexusService;

    constructor(app: Express,
                genomeNexusService: GenomeNexusService = new GenomeNexusService())
    {
        // configure endpoints
        app.get("/api/mutation", this.fetchMutationsGET);

        // init services
        this.genomeNexusService = genomeNexusService;
    }

    @autobind
    private fetchMutationsGET(req: Request, res: Response, next: NextFunction) {
        const hugoSymbol = req.query.hugoSymbol;

        if (hugoSymbol) {
            this.genomeNexusService.getInsightMutationsByHugoSymbol(hugoSymbol)
                .then(response => {
                    res.send(response.data);
                })
                .catch(err => {
                    next(err);
                })
        }
        else {
            res.send([]);
        }
    }
}

export default MutationController;

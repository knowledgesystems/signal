import autobind from "autobind-decorator";
import {Express} from "express";
import {Request, Response} from "express-serve-static-core";

import GeneSummaryService from "../service/GeneSummaryService";

class GeneSummaryController
{
    private geneSummaryService: GeneSummaryService;

    constructor(app: Express,
                geneSummaryService: GeneSummaryService = new GeneSummaryService())
    {
        // configure endpoints
        app.get("/api/frequency/summary/byGene", this.fetchFrequencySummaryByGeneGET);
        app.get("/api/frequency/tumorType/byGene", this.fetchTumorTypeFrequenciesByGeneGET);

        // init services
        this.geneSummaryService = geneSummaryService;
    }

    @autobind
    private fetchFrequencySummaryByGeneGET(req: Request, res: Response)
    {
        res.send(this.geneSummaryService.getFrequencySummaryByGene());
    }

    @autobind
    private fetchTumorTypeFrequenciesByGeneGET(req: Request, res: Response)
    {
        const hugoSymbol = req.query.hugoSymbol;

        if (hugoSymbol) {
            res.send(this.geneSummaryService.getTumorTypeFrequenciesByGene(hugoSymbol));
        }
        else {
            res.send(this.geneSummaryService.getAllTumorTypeFrequenciesByGene());
        }
    }
}

export default GeneSummaryController;

import express from 'express';

import MutationController from "./controller/MutationController";

const app = express();

const port = /*process.env.PORT ||*/ 3001;

const mutationController = new MutationController(app);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Started app on port ${port}`)
});

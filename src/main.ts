import express, { type Express } from "express";
import cors from "cors";
import environment from "./configs/environment.ts";
import router from "./controllers/dates.controller.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(environment.API_VERSION, router);

app.listen(environment.PORT, async () => {
    console.log("Process listening on port " + environment.PORT);
});

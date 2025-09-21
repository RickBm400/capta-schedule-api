import express, { type Express } from "express";
import cors from "cors";
import environment from "./environment.ts";
import router from "../controllers/dates.controller.ts";
import { ExceptionMiddleware } from "../middlewares/index.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(environment.API_VERSION, router);
app.use(ExceptionMiddleware);

export { app };

import express, { type Express } from "express";
import cors from "cors";
import environment from "./environment";
import router from "../controllers/dates.controller";
import { ExceptionMiddleware } from "../middlewares/index";
import morgan from "morgan";

const app: Express = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(environment.API_VERSION, router);
app.use(ExceptionMiddleware);

export { app };

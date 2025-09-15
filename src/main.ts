import express, { type Express } from 'express';
import cors from 'cors';
import environment from './configs/environment.ts';

const app: Express = express();

app.use(cors());

app.listen(environment.PORT, async () => {
  console.log('Process listening on port ' + environment.PORT);
});

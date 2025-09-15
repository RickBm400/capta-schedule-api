import express from 'express';
import cors from 'cors';
import environment from './configs/environment.ts';

const app = express();

app.use(cors());

app.listen(environment.PORT, () => {
  console.log('Process listening on port ' + environment.PORT);
});

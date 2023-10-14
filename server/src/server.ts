import express from 'express';
import Router from './routes/router';
import './config/db/sequelize.config';
import { PORT } from './config/config';

const app: express.Express = express();

app.use(express.json());

app.use('/api', Router);

app.listen(PORT, () => {
  console.log(`ポート${PORT}番で起動しました。`);
});

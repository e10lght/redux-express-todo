import express from 'express';
import Router from './routes/router';
import './config/db/sequelize.config';

const app: express.Express = express();

app.use(express.json());

app.use('/api', Router);

app.listen(3000, () => {
  console.log('ポート3000番で起動しました。');
});

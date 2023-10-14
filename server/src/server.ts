import express from 'express';
import Router from './routes/router';

// import { sequelize } from './config/db/sequelize.config';
import { createUser, getUserById } from './services/users.service';
const app: express.Express = express();

app.get('/c', async (req: express.Request, res: express.Response) => {
  const cUser = {
    user_id: 'xxxxx',
    name: 'test',
    email: 'xxx@example.com',
    user_status: false,
    is_admin: false
  };
  const allUsers = await getUserById('xxxxx');
  // await createUser(cUser)
  console.log(allUsers);

  res.send('こんにちは');
});

app.use(express.json());

app.use('/api', Router);

app.listen(3000, () => {
  console.log('ポート3000番で起動しました。');
});

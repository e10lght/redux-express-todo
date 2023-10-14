import express, { NextFunction, Request, Response } from 'express';
import Router from './routes/router';
import './config/db/sequelize.config';
import { PORT, SECRET_KEY } from './config/config';
import cookieParser from 'cookie-parser';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { ErrorRequestHandler } from 'express';

const app: express.Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'dev') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.headers.host) {
    req.headers.host = 'account-app-client.herokuapp.com';
  }
  next();
});

app.use(cookieParser());

app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req: Request) => req.cookies.token
  }).unless({ path: ['/api/login'] })
);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ message: 'Not authenticated' });
  } else {
    next(err);
  }
};
app.use(errorHandler);

// JWTとcookieの有効期限の延長ミドルウェア
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.auth?.id) {
    const token = jwt.sign({ id: req.auth?.id }, SECRET_KEY, {
      expiresIn: '1h'
    });
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: oneDayInMilliseconds
    });
  }
  next();
});

app.use(express.json());

app.use('/api', Router);

app.listen(PORT, () => {
  console.log(`ポート${PORT}番で起動しました。`);
});

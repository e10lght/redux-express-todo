import * as dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import Router from './routes/router';
import cookieParser from 'cookie-parser';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { ErrorRequestHandler } from 'express';
import { PORT, SECRET_KEY } from './config/config';
import './config/db/sequelize.config';

const app: express.Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestOrigin = req.headers.origin;
  const devOrigin = 'http://localhost:5173';

  if (
    process.env.NODE_ENV !== 'dev' &&
    requestOrigin &&
    requestOrigin.endsWith('.kiraito.com')
  ) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  } else if (process.env.NODE_ENV === 'dev' && requestOrigin === devOrigin) {
    res.setHeader('Access-Control-Allow-Origin', devOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cookieParser());

app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req: Request) => req.cookies.token
  }).unless({
    path: ['/api/login', '/api/logout', '/api/user/create'],
    method: ['OPTIONS'] // putリクエストのプリフライトリクエストのためにOPTIONSリクエストを除外
  })
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
    const oneHour = 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'dev',
      sameSite: 'none',
      maxAge: oneHour
    });
  }
  next();
});

app.use(express.json());

app.use('/api', Router);

app.listen(PORT, () => {
  console.log(`ポート${PORT}番で起動しました。`);
});

import { Request, Response } from 'express';
import { AuthenticationError } from '../errors/AuthenticationError';
import { login } from '../services/auth.service';
import { LoginInput } from '../types/auth';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const body: LoginInput = req.body;

    const { user, token } = await login(body);

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: oneDayInMilliseconds,
      sameSite: 'none',
      secure: true
    });

    res.status(200).json({
      message: 'ログインに成功しました',
      user: { id: user.user_id, name: user.name, email: user.email, token }
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log(error.message);
      res.status(401).json({ message: error.message });
    } else if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'ログアウトに成功しました' });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }
};

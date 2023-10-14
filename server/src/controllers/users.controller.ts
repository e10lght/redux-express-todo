import { Request, Response } from 'express';
import { getUserByUserId } from '../services/users.service';

export const getUser = async (req: Request, res: Response) => {
  const params = req.params;

  const user = await getUserByUserId(params.user_id);

  res.status(200).json(user);
};

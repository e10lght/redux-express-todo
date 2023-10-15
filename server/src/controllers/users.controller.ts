import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import {
  createUser,
  deleteUser,
  getUserByUserId,
  updateUser
} from '../services/users.service';
import { CreateUserInput } from '../types/users';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const user = await getUserByUserId(params.user_id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userId = String(req.auth?.id);
    const createUserInput: CreateUserInput = {
      user_id: uuidv4(),
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      user_status: body.user_status || false,
      is_admin: body.is_admin || false
    };
    await createUser(createUserInput, userId);
    res.status(201).json({ message: 'ユーザ追加に成功しました' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user_id = req.params.user_id;
    const authUserId = String(req.auth?.id);
    await updateUser(user_id, body, authUserId);
    res.status(200).json({ message: 'ユーザの更新が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const targetUser = req.params.user_id;
    const authUserId = String(req.auth?.id);
    await deleteUser(targetUser, authUserId);
    res.status(200).json({ message: 'ユーザの削除が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

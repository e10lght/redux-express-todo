import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createUser,
  deleteUser,
  getUserByUserId,
  updateUser
} from '../services/users.service';
import { CreateUserInput } from '../types/users';

export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const user = await getUserByUserId(params.user_id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const createUserInput: CreateUserInput = {
      user_id: uuidv4(),
      name: body.name,
      email: body.email,
      user_status: body.user_status || false,
      is_admin: body.is_admin || false
    };
    await createUser(createUserInput);
    res.status(201).json({ message: 'ユーザ追加に成功しました' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const params = req.params;
    await updateUser(params.user_id, body);
    res.status(200).json({ message: 'ユーザの更新が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    await deleteUser(params.user_id);
    res.status(200).json({ message: 'ユーザの削除が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

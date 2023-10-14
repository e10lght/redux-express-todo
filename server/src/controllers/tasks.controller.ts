import { Request, Response } from 'express';
import {
  createTask,
  deleteTask,
  getTaskByUser,
  updateTask
} from '../services/tasks.service';
import { CreateTaskInput } from '../types/tasks';
import { v4 as uuidv4 } from 'uuid';

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const user = await getTaskByUser(params.user_id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const createTaskInput: CreateTaskInput = {
      user_id: body.user_id,
      task_id: uuidv4(),
      title: body.title,
      description: body.description,
      due_date: body.due_date,
      is_completed: body.is_completed || false
    };
    await createTask(createTaskInput);
    res.status(201).json({ message: 'タスクの追加に成功しました' });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const params = req.params;
    await updateTask(params.task_id, body);
    res.status(200).json({ message: 'タスクの更新が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    await deleteTask(params.task_id);
    res.status(200).json({ message: 'タスクの削除が完了しました' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

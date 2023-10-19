import { Request, Response } from 'express';
import {
  createTask,
  deleteTask,
  getTaskByUser,
  updateTask
} from '../services/tasks.service';
import { CreateTaskInput } from '../types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const getTaskHandler = async (req: Request, res: Response) => {
  try {
    const userId = String(req.auth?.id);
    const tasks = await getTaskByUser(userId);
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(403).json({ message: error.message });
    } else if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const userId = String(req.auth?.id);

    const createTaskInput: CreateTaskInput = {
      user_id: userId,
      task_id: uuidv4(),
      title: body.title,
      description: body.description,
      due_date: body.due_date,
      is_completed: body.is_completed || false
    };
    await createTask(createTaskInput);
    res.status(201).json({ message: 'タスクの追加に成功しました' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(403).json({ message: error.message });
    } else if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const params = req.params;
    const userId = String(req.auth?.id);
    await updateTask(params.task_id, body, userId);
    res.status(200).json({ message: 'タスクの更新が完了しました' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(403).json({ message: error.message });
    } else if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const userId = String(req.auth?.id);
    await deleteTask(params.task_id, userId);
    res.status(200).json({ message: 'タスクの削除が完了しました' });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      console.log(error.message);
      res.status(403).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};

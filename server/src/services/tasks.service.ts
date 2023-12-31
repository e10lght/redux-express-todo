import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Tasks } from '../models/Tasks';
import { Users } from '../models/Users';
import { CreateTaskInput, Task, UpdateTaskInput } from '../types/tasks';

export const getTaskByUser = async (userId: string): Promise<Task[] | null> => {
  const user = await Users.findOne({
    where: {
      user_id: userId
    }
  });

  if (!user) throw new Error('ユーザーを指定してください');

  // 管理者の場合はすべてのタスクを返す
  if (user.is_admin) return await Tasks.findAll();

  return await Tasks.findAll({
    where: {
      user_id: userId
    }
  });
};

export const createTask = async (input: CreateTaskInput): Promise<void> => {
  const targetUser = await Users.findOne({
    where: {
      user_id: input.user_id
    }
  });
  if (!targetUser) throw new Error('ユーザーが存在しません');
  if (!input.title) throw new Error('タイトルを入力してください');
  if (!input.description) throw new Error('詳細を入力してください');
  if (!input.due_date) throw new Error('期限を入力してください');
  if (new Date(input.due_date) <= new Date())
    throw new Error('過去の日付を設定することはできません');

  await Tasks.create(input);
};

export const updateTask = async (
  task_id: string,
  input: UpdateTaskInput,
  user_id: string
): Promise<void> => {
  const validKeys: Array<keyof UpdateTaskInput> = [
    'title',
    'description',
    'is_completed',
    'due_date'
  ];

  const task = await Tasks.findOne({
    where: {
      task_id
    }
  });

  if (!task) throw new Error('タスクが見つかりません');
  if (task.user_id !== user_id) throw new UnauthorizedError('権限がありません');

  for (const key in input) {
    if (!validKeys.includes(key as keyof UpdateTaskInput))
      throw new Error(`不正なキー「${key}」が指定されました`);
  }

  if (input.title === '') throw new Error('タイトルを入力してください');
  if (input.description === '') throw new Error('説明を入力してください');

  task.set(input);
  await task.save();
};

export const deleteTask = async (
  task_id: string,
  user_id: string
): Promise<void> => {
  const task = await Tasks.findOne({
    where: {
      task_id
    }
  });
  if (!task) throw new Error('タスクが見つかりません');

  if (task.user_id !== user_id) throw new UnauthorizedError('権限がありません');

  await task.destroy();
};

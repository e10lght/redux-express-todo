export type Task = {
  id: number;
  task_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  due_date: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<
  Omit<Task, 'id' | 'task_id' | 'user_id', 'createdAt' | 'updatedAt'>
>;

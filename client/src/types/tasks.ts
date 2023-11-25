export type TasksState = {
  message: string;
  status: number;
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

export type Task = {
  id: number;
  task_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  due_date: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateTaskInput = Partial<
  Omit<Task, 'id' | 'task_id' | 'user_id' | 'createdAt' | 'updatedAt'>
>;

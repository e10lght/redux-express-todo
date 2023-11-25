import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task, UpdateTaskInput } from '../../types/tasks';

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: { message: string; status: number } }
>('tasks/get', async (_arg, thunkAPI) => {
  const response = await fetch('http://localhost:3000/api/task/list', {
    credentials: 'include',
    method: 'get'
  });
  const data = await response.json();

  if (!response.ok) {
    // API呼び出しに失敗した場合、エラーメッセージとステータスを返す
    return thunkAPI.rejectWithValue({
      status: response.status,
      message: data.message
    });
  }

  return data;
});

export const updateTask = createAsyncThunk<
  { message: string; status: number },
  { value: UpdateTaskInput; task_id: string },
  { rejectValue: { message: string; status: number } }
>('tasks/update', async (target, thunkAPI) => {
  const { value, task_id } = target;
  const response = await fetch(
    `http://localhost:3000/api/task/update/${task_id}`,
    {
      credentials: 'include',
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    }
  );
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    // API呼び出しに失敗した場合、エラーメッセージとステータスを返す
    return thunkAPI.rejectWithValue({
      status: response.status,
      message: data.message
    });
  }

  return { status: response.status, message: data.message };
});

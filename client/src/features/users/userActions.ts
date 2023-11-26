import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/user';

export const fetchUser = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string; status: number } }
>('user/get', async (_arg, thunkAPI) => {
  const response = await fetch('http://localhost:3000/api/user/list', {
    credentials: 'include',
    method: 'get'
  });
  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    // API呼び出しに失敗した場合、エラーメッセージとステータスを返す
    return thunkAPI.rejectWithValue({
      status: response.status,
      message: data.message
    });
  }

  return data;
});

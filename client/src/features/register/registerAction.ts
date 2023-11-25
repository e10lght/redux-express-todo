import { createAsyncThunk } from '@reduxjs/toolkit';
import { Register } from '../../types/register';

export const registerUser = createAsyncThunk<
  { message: string; status: number },
  Register,
  { rejectValue: { message: string; status: number } }
>('register/signup', async (value: Register, thunkAPI) => {
  const response = await fetch('http://localhost:3000/api/user/create', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
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

  return { status: response.status, message: data.message };
});

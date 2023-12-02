import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthUser } from '../../types/auth';

export type Login = {
  email: string;
  password: string;
};

export const login = createAsyncThunk<
  AuthUser,
  Login,
  { rejectValue: { message: string; status: number } }
>('auth/login', async (value: Login, thunkAPI) => {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_APP_API_URL}/api/login`,
    {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    }
  );
  const data = await response.json();
  // console.log(data);

  if (!response.ok) {
    // API呼び出しに失敗した場合、エラーメッセージとステータスを返す
    return thunkAPI.rejectWithValue({
      status: response.status,
      message: data.message
    });
  }

  return { user: data.user, status: response.status, message: data.message };
});

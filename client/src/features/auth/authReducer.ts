import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '../../types/auth';
import { login } from './authActions';

const initialState: AuthState = {
  auth: {
    message: '',
    status: 0,
    user: {
      id: '',
      name: '',
      email: '',
      token: ''
    }
  },
  loading: false,
  error: null
};

const authReducer = createReducer(initialState, builder => {
  builder
    .addCase(login.pending, state => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
      state.auth = action.payload;
      state.loading = false;
    })
    // any使わないとエラーになる https://stackoverflow.com/questions/75070687/createreducer-builder-notation-callback-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload?.message;
      state.loading = false;
    });
});

export default authReducer;

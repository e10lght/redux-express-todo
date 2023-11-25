import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { RegisterState } from '../../types/register';
import { registerUser } from './registerAction';

const initialState: RegisterState = {
  message: '',
  status: 0,
  loading: false,
  error: null
};

const registerReducer = createReducer(initialState, builder => {
  builder
    .addCase(registerUser.pending, state => {
      state.loading = true;
    })
    .addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<{ message: string; status: number }>) => {
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.loading = false;
      }
    )
    // any使わないとエラーになる https://stackoverflow.com/questions/75070687/createreducer-builder-notation-callback-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload?.message;
      state.loading = false;
    });
});

export default registerReducer;

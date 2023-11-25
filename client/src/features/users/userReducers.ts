import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '../../types/user';
import { fetchUser } from './userActions';

const initialState: UserState = {
  data: [],
  loading: false,
  error: null
};

const userReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchUser.pending, state => {
      state.loading = true;
    })
    .addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<User | User[]>) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.data = action.payload; // <-- 配列を直接代入
        } else {
          state.data = [action.payload]; // <-- 単一のUserを配列にして代入
        }
        state.loading = false;
      }
    )
    // any使わないとエラーになる https://stackoverflow.com/questions/75070687/createreducer-builder-notation-callback-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(fetchUser.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload?.message;
      state.loading = false;
    });
});

export default userReducer;

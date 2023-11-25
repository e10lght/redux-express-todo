import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState } from '../../types/tasks';
import { fetchTasks, updateTask } from './taskAction';

const initialState: TasksState = {
  message: '',
  status: 0,
  tasks: [],
  loading: false,
  error: null
};

const tasksReducer = createReducer(initialState, builder => {
  builder
    .addCase(fetchTasks.pending, state => {
      state.loading = true;
    })
    .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.loading = false;
    })
    // any使わないとエラーになる https://stackoverflow.com/questions/75070687/createreducer-builder-notation-callback-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload?.message;
      state.loading = false;
    })
    .addCase(updateTask.pending, state => {
      // updateTaskが実行中の状態を設定
      state.loading = true;
    })
    .addCase(
      updateTask.fulfilled,
      (state, action: PayloadAction<{ message: string; status: number }>) => {
        // updateTaskが完了した後の状態を設定
        state.message = action.payload.message;
        state.status = action.payload.status;
        state.loading = false;
      }
    )
    // any使わないとエラーになる https://stackoverflow.com/questions/75070687/createreducer-builder-notation-callback-error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload?.message;
      state.loading = false;
    });
});

export default tasksReducer;

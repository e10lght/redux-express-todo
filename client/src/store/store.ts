import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authReducer';
import registerReducer from '../features/register/registerReducer';
import tasksReducer from '../features/tasks/taskReducer';
import userReducer from '../features/users/userReducers';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    task: tasksReducer,
    register: registerReducer
  }
});

export type AppDispatch = typeof store.dispatch;

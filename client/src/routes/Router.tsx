import { Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { NotFound } from '../pages/NotFound';
import { RegisterPage } from '../pages/RegisterPage';
import { UserProfilePage } from '../pages/UserMyPage';
import { TasksPage } from '../pages/TasksPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';

export const Router = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/user/tasks" element={<TasksPage />} />
        <Route path="/user/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/user/mypage" element={<UserProfilePage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

import { Box } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { TaskDetail } from '../features/tasks/components/TaskDetail/TaskDetail';

export const TaskDetailPage = () => {
  return (
    <>
      <Header />
      <Box mt="20" />
      <TaskDetail />
    </>
  );
};

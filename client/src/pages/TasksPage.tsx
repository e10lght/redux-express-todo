import { Box } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { TaskList } from '../features/tasks/components/TaskList';

export const TasksPage = () => {
  return (
    <>
      <Header />
      <Box mt="14" />
      <TaskList />
    </>
  );
};

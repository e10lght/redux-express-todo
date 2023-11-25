import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store/store';
import { Task, TasksState } from '../../../types/tasks';
import { fetchTasks, updateTask } from '../taskAction';
import {
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  useToast
} from '@chakra-ui/react';
import { UpdateForm } from './UpdateForm';
import { CompletedTasksTable } from './CompletedTasksTable';
import { IncompletedTasksTable } from './IncompletedTasksTable';

export const TaskList = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const tasks =
    useSelector((state: { task: TasksState }) => state.task.tasks) || [];
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchTasks())
      .unwrap()
      .catch(err => {
        console.log(err.status);
        console.log(err.message);
        navigate('/');
      });
  }, []);

  const toggleTaskCompletion = (task: Task) => {
    console.log('completeTask');
    const { task_id, is_completed } = task;
    dispatch(
      updateTask({ value: { is_completed: !is_completed }, task_id })
    ).then(res => {
      if (!res.payload) {
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color="white" p={3} bg="tomato">
              不具合が発生しました。
            </Box>
          )
        });
      }
      if (res.payload?.status === 403) {
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color="white" p={3} bg="tomato">
              {res.payload?.message}
            </Box>
          )
        });
      } else if (res.payload?.status === 200) {
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color="white" p={3} bg="teal.500">
              {res.payload?.message}
            </Box>
          )
        });
        dispatch(fetchTasks());
      }
    });
    // チェックのデバウンス処理と失敗時のチェック戻しと更新後の再フェッチ
  };

  return (
    <>
      <IncompletedTasksTable
        toggleTaskCompletion={toggleTaskCompletion}
        tasks={tasks}
        onOpen={onOpen}
      />

      <div>完了</div>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <AccordionIcon />
              <Box as="h2" flex="1" textAlign="left" ml={4}>
                COMPLETED LIST
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel p={0}>
            <CompletedTasksTable
              toggleTaskCompletion={toggleTaskCompletion}
              tasks={tasks}
              onOpen={onOpen}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <UpdateForm isOpen={isOpen} onClose={onClose} />
    </>
  );
};

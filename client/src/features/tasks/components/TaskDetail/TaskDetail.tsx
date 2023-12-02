import { EditIcon } from '@chakra-ui/icons';
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppDispatch } from '../../../../store/store';
import { Task, TasksState } from '../../../../types/tasks';
import { fetchTasks } from '../../taskAction';
import { DeleteCheckPopover } from '../DeleteCheckPopover';
import { UpdateForm } from '../UpdateForm';

export const TaskDetail = () => {
  const { taskId } = useParams();
  const tasks =
    useSelector((state: { task: TasksState }) => state.task.tasks) || {};
  const [targetTask, setTargetTask] = useState<Partial<Task>>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (tasks) {
      const target = tasks.find(task => task.task_id === taskId);
      if (target) {
        setTargetTask(target);
        return;
      }
    }
    dispatch(fetchTasks())
      .unwrap()
      .then(tasks => {
        return tasks.find(task => task.task_id === taskId);
      })
      .then(target => {
        if (!target) throw new Error('タスクが見つかりません');
        setTargetTask(target);
      })
      .catch(err => {
        navigate('/');
        console.error(err.message);
      });
  }, []);

  return (
    <>
      <Card m={5}>
        <Link
          to="/user/tasks"
          style={{
            margin: '10px',
            color: '#007bff',
            textDecoration: 'none'
          }}
        >
          ◀ Back to list
        </Link>
        <CardHeader
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Heading size="md" style={{ textAlign: 'right' }}>
            {targetTask?.title}
          </Heading>
          <nav>
            <button
              onClick={() => {
                onOpen();
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                marginRight: '10px' // アイコン間の間隔
              }}
            >
              <EditIcon color="#0099dd" />
            </button>
            <DeleteCheckPopover taskid={targetTask.task_id!} />
          </nav>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Discription
              </Heading>
              <Text pt="2" fontSize="sm">
                {targetTask?.description}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                status
              </Heading>
              <Text pt="2" fontSize="sm">
                {targetTask?.is_completed ? 'Complete' : 'Incomplete'}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Duedate
              </Heading>
              <Text pt="2" fontSize="sm">
                {dayjs(targetTask?.due_date).format('YYYY年MM月DD日')}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                created
              </Heading>
              <Text pt="2" fontSize="sm">
                {dayjs(targetTask?.createdAt).format('YYYY年MM月DD日')}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                updated
              </Heading>
              <Text pt="2" fontSize="sm">
                {dayjs(targetTask?.updatedAt).format('YYYY年MM月DD日')}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <UpdateForm isOpen={isOpen} onClose={onClose} task={targetTask} />
    </>
  );
};

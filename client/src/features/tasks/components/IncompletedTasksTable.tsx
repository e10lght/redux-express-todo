import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../../../types/tasks';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Checkbox,
  useMediaQuery
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { DeleteCheckPopover } from './DeleteCheckPopover';

type TypeIncompletedTasksTable = {
  toggleTaskCompletion: (task: Task) => void;
  tasks: Task[];
  updateTaskModal: (task: Task) => void;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
};

export const IncompletedTasksTable: FC<TypeIncompletedTasksTable> = props => {
  const { toggleTaskCompletion, tasks, updateTaskModal } = props;
  const [isMobile] = useMediaQuery('(max-width: 450px)');

  return (
    <>
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              {isMobile ? (
                <>
                  <Th width="15%"></Th>
                  <Th width="85%">title</Th>
                </>
              ) : (
                <>
                  <Th width="5%"></Th>
                  <Th width="15%">title</Th>
                  <Th width="40%">description</Th>
                  <Th width="20%">duedate</Th>
                  <Th width="10%">completed</Th>
                  <Th width="5%"></Th>
                  <Th width="5%"></Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {tasks
              .filter(task => !task.is_completed)
              .map(task => (
                <Tr
                  key={task.id}
                  _hover={{
                    bg: 'rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <Td>
                    <Checkbox
                      title="完了にする"
                      onChange={() => toggleTaskCompletion(task)}
                      isChecked={task.is_completed}
                    />
                  </Td>
                  <Td>
                    <Link to={`/user/tasks/${task.task_id}`}>
                      <Text
                        _hover={{
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                        style={{ color: '#00bbdd' }}
                      >
                        {truncateText(task.title, 10)}
                      </Text>
                    </Link>
                  </Td>
                  {!isMobile && (
                    <>
                      <Td>{truncateText(task.description, 30)}</Td>
                      <Td>{dayjs(task.due_date).format('YYYY年MM月DD日')}</Td>
                      <Td>{task.is_completed ? '完了' : '未完了'}</Td>
                      <Td>
                        <button
                          onClick={() => updateTaskModal(task)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <EditIcon color="#0099dd" />
                        </button>
                      </Td>
                      <Td>
                        <DeleteCheckPopover taskid={task.task_id} />
                      </Td>
                    </>
                  )}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

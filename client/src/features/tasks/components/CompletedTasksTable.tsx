import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';

type TypeCompletedTasksTable = {
  toggleTaskCompletion: (task: Task) => void;
  tasks: Task[];
  onOpen: () => void;
};

export const CompletedTasksTable: FC<TypeCompletedTasksTable> = props => {
  const { toggleTaskCompletion, tasks, onOpen } = props;
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery('(max-width: 450px)');
  return (
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
            .filter(task => task.is_completed)
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
                  <Text
                    onClick={() => navigate(`/user/tasks/${task.task_id}`)} // ここは詳細ページに飛ばしてもいいかも（パス指定する）
                    _hover={{
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    style={{ color: '#00bbdd' }}
                  >
                    {task.title}
                  </Text>
                </Td>
                {!isMobile && (
                  <>
                    <Td>{task.description}</Td>
                    <Td>{dayjs(task.due_date).format('YYYY年MM月DD日')}</Td>
                    <Td>{task.is_completed ? '完了' : '未完了'}</Td>
                    <Td>
                      <button
                        onClick={onOpen}
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
                      <DeleteIcon color="tomato" />
                    </Td>
                  </>
                )}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

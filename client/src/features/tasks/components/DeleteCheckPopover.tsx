import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  useDisclosure,
  useToast,
  Box
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { deleteTask, fetchTasks } from '../taskAction';

type TDeleteCheckPopover = {
  taskid: string;
};

export const DeleteCheckPopover: React.FC<TDeleteCheckPopover> = props => {
  const { taskid } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch: AppDispatch = useDispatch();

  const toast = useToast();

  const deleteExcute = async () => {
    dispatch(deleteTask(taskid)).then(res => {
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
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
    >
      <PopoverTrigger>
        <button
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer'
          }}
          aria-label="Delete item"
          onClick={onOpen}
        >
          <DeleteIcon color="tomato" />
        </button>
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverArrow />
        <PopoverBody color="gray.900">本当に削除しますか？</PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <Button size="sm" colorScheme="red" mr={3} onClick={deleteExcute}>
            削除
          </Button>
          <Button size="sm" colorScheme="gray" onClick={onClose}>
            キャンセル
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

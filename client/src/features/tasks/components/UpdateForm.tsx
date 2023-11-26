import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Select
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { fetchTasks, updateTask } from '../taskAction';
import { Task } from '../../../types/tasks';
import dayjs from 'dayjs';
import { AppDispatch } from '../../../store/store';

type UpdateFormType = {
  isOpen: boolean;
  onClose: () => void;
  task: Partial<Task>;
};

export const UpdateForm: React.FC<UpdateFormType> = props => {
  const { isOpen, onClose, task } = props;
  console.log(task);

  const schema = z.object({
    title: z.string().min(1, '必須項目です'),
    description: z.string().min(1, '必須項目です'),
    due_date: z.string(),
    is_completed: z.boolean()
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setValue
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const dispatch = useDispatch<AppDispatch>();

  const toast = useToast();

  useEffect(() => {
    clearErrors('root');
    setValue('title', task.title!);
    setValue('description', task.description!);
    setValue('due_date', dayjs(task.due_date!).format('YYYY-MM-DD'));
    setValue('is_completed', task.is_completed!);
  }, [task]);

  const onSubmit = async (value: z.infer<typeof schema>) => {
    console.log(value);
    const res = await dispatch(
      updateTask({
        value,
        task_id: task.task_id!
      })
    );
    console.log(res.payload);
    if (!res.payload) {
      setError('root', { type: 'server', message: '不具合が発生しました。' });
    }
    if (res.payload?.status === 403) {
      setError('root', { type: 'server', message: res.payload.message });
    } else if (res.payload?.status === 500) {
      setError('root', { type: 'server', message: res.payload.message });
    } else if (res.payload?.status === 400) {
      setError('root', { type: 'server', message: res.payload.message });
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
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="black" border="1px solid #333">
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={4} isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">title</FormLabel>
              <Input
                id="title"
                placeholder="title"
                bg="#444444de"
                border="none"
                {...register('title')}
                onChange={e => {
                  clearErrors('root');
                  register('title').onChange(e);
                }}
                _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <FormErrorMessage>
                {typeof errors.title?.message === 'string'
                  ? errors.title.message
                  : null}
              </FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={!!errors.description}>
              <FormLabel htmlFor="description">description</FormLabel>
              <Textarea
                id="description"
                placeholder="description"
                bg="#444444de"
                border="none"
                {...register('description')}
                onChange={e => {
                  clearErrors('root');
                  register('description').onChange(e);
                }}
                _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <FormErrorMessage>
                {typeof errors.description?.message === 'string'
                  ? errors.description.message
                  : null}
              </FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={!!errors.due_date}>
              <FormLabel htmlFor="due_date">duedate</FormLabel>
              <Input
                id="due_date"
                placeholder="due_date"
                bg="#444444de"
                border="none"
                type="date"
                {...register('due_date')}
                onChange={e => {
                  clearErrors('root');
                  register('due_date').onChange(e);
                }}
                _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <FormErrorMessage>
                {typeof errors.due_date?.message === 'string'
                  ? errors.due_date.message
                  : null}
              </FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={!!errors.is_completed}>
              <FormLabel htmlFor="isConpleted">isConpleted</FormLabel>
              <Select
                id="is_completed"
                bg="#444444de"
                border="none"
                onChange={e => {
                  clearErrors('root');
                  const value = e.target.value === '完了';
                  console.log(e.target.value);
                  console.log(value);
                  setValue('is_completed', value);
                  register('is_completed');
                }}
              >
                <option value="未完了">未完了</option>
                <option value="完了">完了</option>
              </Select>
              <FormErrorMessage>
                {typeof errors.is_completed?.message === 'string'
                  ? errors.is_completed.message
                  : null}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.root}>
              <FormErrorMessage>
                {typeof errors.root?.message === 'string'
                  ? errors.root.message
                  : null}
              </FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
              w="100%"
              mt={4}
            >
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

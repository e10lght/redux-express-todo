import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Text,
  useDisclosure,
  Box
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { AddIcon } from '@chakra-ui/icons';
import { fetchTasks, insertTask } from '../taskAction';

export const InsertFormModal = () => {
  const schema = z.object({
    title: z.string().min(1, '必須項目です'),
    description: z.string().min(1, '必須項目です'),
    due_date: z.string().min(1, '必須項目です')
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const onSubmit = async (value: z.infer<typeof schema>) => {
    console.log(value);
    const res = await dispatch(
      insertTask({
        value
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
    } else if (res.payload?.status === 201) {
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
    <>
      <Button
        my={5}
        mr={5}
        bg="#000099"
        border="1px solid #666"
        color="#e8eaed"
        _hover={{ bg: '#00009999' }}
        onClick={onOpen}
      >
        <AddIcon boxSize={4} />
        <Text ml={2}>new task</Text>
      </Button>
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
    </>
  );
};

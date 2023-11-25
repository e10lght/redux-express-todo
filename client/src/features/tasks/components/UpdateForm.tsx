import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';

type Modal = {
  isOpen: boolean;
  onClose: () => void;
};

export const UpdateForm: React.FC<Modal> = props => {
  const { isOpen, onClose } = props;

  const schema = z.object({
    email: z
      .string()
      .min(1, '必須項目です')
      .email('メールアドレスの形式が正しくありません'),
    password: z
      .string()
      .min(1, '必須項目です')
      .min(8, 'パスワードは8文字以上で入力してください')
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm({
    resolver: zodResolver(schema)
  });

  const dispatch = useDispatch();

  const toast = useToast();

  const onSubmit = async (value: any) => {
    const res = await dispatch(login(value));
    if (!res.payload) {
      setError('root', { type: 'server', message: '不具合が発生しました。' });
    }
    if (res.payload?.status === 401) {
      setError('root', { type: 'server', message: res.payload.message });
    } else if (res.payload?.status === 500) {
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
            <FormControl mb={4} isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">email</FormLabel>
              <Input
                id="email"
                placeholder="email"
                bg="#444444de"
                border="none"
                {...register('email')}
                onChange={e => {
                  clearErrors('root');
                  register('email').onChange(e);
                }}
                _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <FormErrorMessage>
                {typeof errors.email?.message === 'string'
                  ? errors.email.message
                  : null}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">password</FormLabel>
              <Input
                id="password"
                placeholder="password"
                bg="#444444de"
                border="none"
                {...register('password')}
                onChange={e => {
                  clearErrors('root'); // サーバーエラーをクリア
                  register('password').onChange(e); // react-hook-formのonChangeを呼び出す
                }}
                _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <FormErrorMessage>
                {typeof errors.password?.message === 'string'
                  ? errors.password.message
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

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Task finished
          </Button>
          <Button colorScheme="red">Task delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

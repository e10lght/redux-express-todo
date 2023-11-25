import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Login, login } from '../authActions';
import { useNavigate } from 'react-router-dom';

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

export const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<Login>({
    resolver: zodResolver(schema)
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toast = useToast();

  const onSubmit = async (value: Login) => {
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
      navigate('/user/tasks');
    }
  };

  return (
    <>
      <Heading mb={3} textAlign="center">
        Login
      </Heading>
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
            type="password"
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
          w="100%"
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
        <Flex justifyContent="flex-end" mt={3}>
          <Text mr={2}>Not already a member?</Text>
          <Link href="/signup" color="teal.500">
            Sign Up
          </Link>
        </Flex>
      </form>
    </>
  );
};

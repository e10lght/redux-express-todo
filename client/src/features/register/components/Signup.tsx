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
import { useNavigate } from 'react-router-dom';
import { Register } from '../../../types/register';
import { registerUser } from '../registerAction';
import { login } from '../../auth/authActions';

const schema = z.object({
  email: z
    .string()
    .min(1, '必須項目です')
    .email('メールアドレスの形式が正しくありません'),
  password: z
    .string()
    .min(1, '必須項目です')
    .min(8, 'パスワードは8文字以上で入力してください'),
  name: z
    .string()
    .min(1, '必須項目です')
    .max(15, '名前は15文字以下で入力してください')
});

export const Signup = () => {
  console.log('hi');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<Register>({
    resolver: zodResolver(schema)
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toast = useToast();

  const onSubmit = async (value: Register) => {
    console.log('1');
    const res = await dispatch(registerUser(value));
    console.log(res);
    if (!res.payload) {
      setError('root', { type: 'server', message: '不具合が発生しました。' });
    }
    if (res.payload?.status === 401) {
      setError('root', { type: 'server', message: res.payload.message });
    } else if (res.payload?.status === 400) {
      setError('root', { type: 'server', message: res.payload.message });
    } else if (res.payload?.status === 500) {
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
      const loginUser = await dispatch(
        login({
          email: value.email,
          password: value.password
        })
      );
      if (loginUser.payload?.status !== 200) {
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color="white" p={3} bg="teal.500">
              {loginUser.payload?.message}
            </Box>
          )
        });
        navigate('/');
      } else {
        navigate('/user/tasks');
      }
    }
  };

  return (
    <>
      <Heading mb={3} textAlign="center">
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={2} isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">name</FormLabel>
          <Input
            id="name"
            placeholder="name"
            bg="#444444de"
            border="none"
            {...register('name')}
            onChange={e => {
              clearErrors('root'); // サーバーエラーをクリア
              register('name').onChange(e); // react-hook-formのonChangeを呼び出す
            }}
            _placeholder={{ color: 'rgba(255, 255, 255, 0.5)' }}
          />
          <FormErrorMessage>
            {typeof errors.name?.message === 'string'
              ? errors.name.message
              : null}
          </FormErrorMessage>
        </FormControl>

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

        <FormControl mb={4} isInvalid={!!errors.password}>
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
          w="100%"
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
        <Flex justifyContent="flex-end" mt={3}>
          <Text mr={2}>Already a member?</Text>
          <Link href="/" color="teal.500">
            Login
          </Link>
        </Flex>
      </form>
    </>
  );
};

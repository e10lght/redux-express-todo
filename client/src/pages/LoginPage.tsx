import { Box, Flex, Image } from '@chakra-ui/react';
import { LoginForm } from '../features/auth/components/LoginForm';
import logo from '../assets/logo3.png';

export const LoginPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      h="80vh"
      w="100vw"
      flexDirection="column"
    >
      <Image src={logo} alt="Logo" w={150} h={150} mb={3} />
      <Box
        p={4}
        w="400px"
        borderRadius="md"
        boxShadow="md"
        borderColor="gray.600"
        borderWidth="1px"
      >
        <LoginForm />
      </Box>
    </Flex>
  );
};

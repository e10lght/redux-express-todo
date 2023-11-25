import { Box, Flex, Image } from '@chakra-ui/react';
import { Signup } from '../features/register/components/Signup';
import logo from '../assets/logo3.png';

export const RegisterPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
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
        <Signup />
      </Box>
    </Flex>
  );
};

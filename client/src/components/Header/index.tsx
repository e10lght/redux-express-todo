import {
  Heading,
  Flex,
  Spacer,
  Box,
  Button,
  useToast,
  Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const logout = async () => {
    console.log(import.meta.env.VITE_REACT_APP_API_URL);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/logout`,
        {
          credentials: 'include',
          method: 'GET'
        }
      );
      const result = await response.json();
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color="white" p={3} bg="teal.500">
            {result.message}
          </Box>
        )
      });
      navigate('/');
    } catch (error) {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box color="white" p={3} bg="teal.500">
            ログアウトできませんでした
          </Box>
        )
      });
    }
  };
  return (
    <Flex
      align="center"
      justify="space-between"
      h="14"
      color="gray.100"
      minWidth="max-content"
      alignItems="center"
      gap="2"
      borderBottom="1px solid #333"
      position="fixed"
      top="0"
      left="0"
      right="0"
      width="100%"
      zIndex="10"
    >
      <Box p="5">
        <Heading size="md" as="h1">
          <Text>TODO Lists</Text>
        </Heading>
      </Box>
      <Spacer />
      <Flex gap={4} alignItems="center">
        <Button
          variant="link"
          onClick={() => navigate('/user/mypage')}
          style={{ fontSize: '1em' }}
          color="#E2E8F0"
        >
          My Page
        </Button>
        <Box pr="4">
          <Button variant="link" color="#E2E8F0" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
};

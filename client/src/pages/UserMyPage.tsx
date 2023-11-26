import { Box } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { Users } from '../features/users/components/Users';

export const UserProfilePage = () => {
  return (
    <>
      <Header />
      <Box mt="20" />
      <Users />
    </>
  );
};

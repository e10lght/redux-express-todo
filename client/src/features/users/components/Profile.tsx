import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { User } from '../../../types/user';

type TProfile = {
  user: User;
};

export const Profile: React.FC<TProfile> = props => {
  const { user } = props;

  return (
    <Card m={5}>
      <Link
        to="/user/tasks"
        style={{
          margin: '10px',
          color: '#007bff',
          textDecoration: 'none'
        }}
      >
        ◀ Back to list
      </Link>
      <CardHeader
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Heading size="md" style={{ textAlign: 'right' }}>
          Profile
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              userid
            </Heading>
            <Text pt="2" fontSize="sm">
              {user.user_id}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              name
            </Heading>
            <Text pt="2" fontSize="sm">
              {user.name}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              email
            </Heading>
            <Text pt="2" fontSize="sm">
              {user.email}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              status
            </Heading>
            <Text pt="2" fontSize="sm">
              {user.user_status ? 'active' : 'invalid'}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              usertype
            </Heading>
            <Text pt="2" fontSize="sm">
              {user.is_admin ? 'admin' : 'member'}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

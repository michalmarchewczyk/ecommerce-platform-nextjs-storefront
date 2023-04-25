import { headers } from 'next/headers';
import Link from 'next/link';
import { IconLogout } from '@tabler/icons';
import {
  Avatar,
  Button,
  Flex,
  Paper,
  Text,
  Title,
} from '@lib/components/wrappers';
import { usersApi } from '@lib/api';

async function getAccount() {
  const cookie = headers().get('cookie') ?? '';
  const req = usersApi.getCurrentUser({
    cache: 'no-store',
    headers: { cookie },
  });
  try {
    return await req;
  } catch (e) {
    return null;
  }
}

export const metadata = {
  title: 'Account',
};

export default async function Page() {
  const data = await getAccount();
  const initials = `${data?.firstName?.[0] ?? ''}${data?.lastName?.[0] ?? ''}`;
  return (
    <>
      <Title order={2} mb="md">
        My account
      </Title>
      <Paper withBorder p="md">
        <Flex direction="row" gap={20} wrap="wrap" w="100%" align="center">
          <Avatar color="indigo" size={64} radius="xl">
            {initials}
          </Avatar>
          <Flex direction="column" gap={0} sx={{ flex: 1 }}>
            <Text fw={600} fz={24}>
              {data?.firstName} {data?.lastName}
            </Text>
            <Text fw={500} fz={20} c="gray.7">
              {data?.email}
            </Text>
          </Flex>
          <Button
            variant="filled"
            component={Link}
            href="/logout"
            size="md"
            leftIcon={<IconLogout />}
          >
            Sign out
          </Button>
        </Flex>
      </Paper>
    </>
  );
}

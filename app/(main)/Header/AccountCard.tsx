import {
  IconFileInvoice,
  IconHeart,
  IconLogin,
  IconLogout,
  IconUser,
  IconUserPlus,
} from '@tabler/icons';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { usersApi } from '../../../lib/api';
import {
  ActionIcon,
  HoverCard,
  HoverCardTarget,
  HoverCardDropdown,
  Button,
  Divider,
  Stack,
  Avatar,
  Center,
  Text,
  Box,
  Flex,
} from '../../../lib/components/wrappers';

async function getAccount() {
  const reqCookies = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  const req = usersApi.getCurrentUser({
    cache: 'no-store',
    headers: {
      Cookie: reqCookies,
    },
  });
  try {
    return await req;
  } catch (e) {
    return null;
  }
}

export default async function AccountCard() {
  const data = await getAccount();
  const initials = `${data?.firstName?.[0] ?? ''}${data?.lastName?.[0] ?? ''}`;

  return (
    <HoverCard
      width={240}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
      zIndex={2000}
    >
      <HoverCardTarget>
        {data ? (
          <Avatar
            color="indigo"
            size={44}
            radius="xl"
            sx={{ cursor: 'pointer' }}
          >
            {initials}
          </Avatar>
        ) : (
          <ActionIcon size="xl" radius="xl">
            <IconUser size="26" />
          </ActionIcon>
        )}
      </HoverCardTarget>
      <HoverCardDropdown>
        {data ? (
          <Stack spacing="xs">
            <Flex gap="sm" sx={{ overflow: 'hidden' }} align="center">
              <Avatar color="indigo" size={60} radius={30}>
                {initials}
              </Avatar>
              <Box sx={{ width: '132px', overflow: 'hidden' }}>
                <Text
                  fz={18}
                  fw={600}
                  lineClamp={1}
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {data.firstName} {data.lastName}
                </Text>
                <Text
                  fz={16}
                  fw={500}
                  c="gray.7"
                  lineClamp={1}
                  mt={-3}
                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {data.email}
                </Text>
              </Box>
            </Flex>
            <Divider mx="-md" my={4} />
            <Button
              component={Link}
              href="/account"
              leftIcon={<IconUser />}
              variant="light"
            >
              My account
            </Button>
            <Button
              component={Link}
              href="/account/orders"
              leftIcon={<IconFileInvoice />}
              variant="light"
            >
              My orders
            </Button>
            <Button
              component={Link}
              href="/account/wishlists"
              leftIcon={<IconHeart />}
              variant="light"
            >
              My wishlists
            </Button>
            <Divider mx="-md" my={4} />
            <Button
              variant="filled"
              component={Link}
              href="/logout"
              leftIcon={<IconLogout />}
            >
              Sign out
            </Button>
          </Stack>
        ) : (
          <Stack spacing="sm">
            <Center h={60}>
              <Text fz={20} fw={400} c="gray.6">
                You are not signed in
              </Text>
            </Center>
            <Divider mx="-md" />
            <Button component={Link} href="/login" leftIcon={<IconLogin />}>
              Sign in
            </Button>
            <Button
              variant="light"
              component={Link}
              href="/register"
              leftIcon={<IconUserPlus />}
            >
              Create account
            </Button>
          </Stack>
        )}
      </HoverCardDropdown>
    </HoverCard>
  );
}

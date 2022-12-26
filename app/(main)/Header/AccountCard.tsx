import { IconUser } from '@tabler/icons';
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

  return (
    <HoverCard
      width={240}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCardTarget>
        <ActionIcon size="lg">
          <IconUser size={26} />
        </ActionIcon>
      </HoverCardTarget>
      <HoverCardDropdown>
        {data ? (
          <Stack>
            {data.email}
            <Divider />
            <Button variant="light" component={Link} href="/logout">
              Sign out
            </Button>
          </Stack>
        ) : (
          <Stack spacing="sm">
            <Button component={Link} href="/login">
              Sign in
            </Button>
            <Divider />
            <Button variant="light" component={Link} href="/register">
              Create account
            </Button>
          </Stack>
        )}
      </HoverCardDropdown>
    </HoverCard>
  );
}

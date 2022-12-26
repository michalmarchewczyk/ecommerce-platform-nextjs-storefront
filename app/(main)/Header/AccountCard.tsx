import { IconUser } from '@tabler/icons';
import Link from 'next/link';
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

async function getData() {
  try {
    return await usersApi.getCurrentUser();
  } catch (e) {
    return null;
  }
}

export default async function AccountCard() {
  const data = await getData();

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
          <div>Account info</div>
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

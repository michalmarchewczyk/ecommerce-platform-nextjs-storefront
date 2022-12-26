import { IconShoppingCart } from '@tabler/icons';
import { cookies } from 'next/headers';
import { cartsApi } from '../../../lib/api';
import {
  ActionIcon,
  HoverCard,
  HoverCardTarget,
  HoverCardDropdown,
} from '../../../lib/components/wrappers';

async function getCart() {
  const reqCookies = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return cartsApi.getCart({
    cache: 'no-store',
    headers: {
      Cookie: reqCookies,
    },
  });
}

export default async function CartCard() {
  const data = await getCart();

  return (
    <HoverCard
      width={400}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCardTarget>
        <ActionIcon size="lg">
          <IconShoppingCart size={26} />
        </ActionIcon>
      </HoverCardTarget>
      <HoverCardDropdown>{JSON.stringify(data)}</HoverCardDropdown>
    </HoverCard>
  );
}

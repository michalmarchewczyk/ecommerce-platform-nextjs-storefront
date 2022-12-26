import { IconShoppingCart } from '@tabler/icons';
import { cartsApi } from '../../../lib/api';
import {
  ActionIcon,
  HoverCard,
  HoverCardTarget,
  HoverCardDropdown,
} from '../../../lib/components/wrappers';

async function getData() {
  return cartsApi.getCart();
}

export default async function CartCard() {
  const data = await getData();

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
      <HoverCardDropdown>Empty cart</HoverCardDropdown>
    </HoverCard>
  );
}

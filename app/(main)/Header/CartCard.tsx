import { IconShoppingCart } from '@tabler/icons';
import { headers } from 'next/headers';
import Link from 'next/link';
import { cartsApi } from '../../../lib/api';
import {
  ActionIcon,
  HoverCard,
  HoverCardTarget,
  HoverCardDropdown,
  Center,
  Text,
  Divider,
  Title,
  Group,
  Button,
  Stack,
  Indicator,
} from '../../../lib/components/wrappers';
import Price from '../products/Price';
import CartCardItem from './CartCardItem';

async function getCart() {
  const cookie = headers().get('cookie') ?? '';
  return cartsApi.getCart({
    cache: 'no-store',
    headers: { cookie },
  });
}

export default async function CartCard() {
  const cart = await getCart();
  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <HoverCard
      width={360}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
      zIndex={2000}
    >
      <HoverCardTarget>
        <Indicator
          position="bottom-end"
          size={cart.items.length > 0 ? 18 : 0}
          label={cart.items.length}
          showZero={false}
          offset={6}
        >
          <ActionIcon size="xl" radius="xl" component={Link} href="/cart">
            <IconShoppingCart size={26} />
          </ActionIcon>
        </Indicator>
      </HoverCardTarget>
      <HoverCardDropdown>
        {cart.items.length === 0 && (
          <Center h={100}>
            <Text fz={24} fw={400} c="gray.6">
              Your cart is empty
            </Text>
          </Center>
        )}
        {cart.items.length > 0 && (
          <>
            <Group position="apart">
              <Title order={4}>Cart</Title>
              <Text fz={16} fw={500} c="gray.8">
                {cart.items.length} item{cart.items.length > 1 && 's'}
              </Text>
            </Group>
            <Divider my="sm" mx="-md" />
            <Stack spacing={0} mx={-6}>
              {cart.items
                .reverse()
                .slice(0, 6)
                .map((item) => (
                  <CartCardItem key={item.id} item={item} />
                ))}
              {cart.items.length > 6 && (
                <Button
                  variant="subtle"
                  component={Link}
                  href="/cart"
                  w="100%"
                  color="gray.7"
                  size="md"
                >
                  + {cart.items.length - 6} more items
                </Button>
              )}
            </Stack>
            <Divider my="sm" mx="-md" />
            <Group position="apart">
              <div>
                <Text fz={14} fw={500} c="gray.6" mb={-2}>
                  Total
                </Text>
                <Text fz={18} fw={600} c="gray.9">
                  {/* @ts-expect-error Server Component */}
                  <Price price={total} />
                </Text>
              </div>
              <Button radius="xl" size="md" component={Link} href="/cart">
                View cart
              </Button>
            </Group>
          </>
        )}
      </HoverCardDropdown>
    </HoverCard>
  );
}

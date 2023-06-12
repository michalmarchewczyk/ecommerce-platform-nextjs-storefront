import { headers } from 'next/headers';
import Link from 'next/link';
import { IconChevronRight } from '@tabler/icons';
import { cartsApi } from '@lib/api';
import {
  Box,
  Button,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
} from '@lib/components/wrappers';
import Price from '@lib/components/ui/Price';
import CartItem from './CartItem';
import ClearCartButton from './ClearCartButton';

export const revalidate = 0;

async function getCart() {
  const cookie = headers().get('cookie') ?? '';
  return cartsApi.getCart({
    cache: 'no-store',
    headers: { cookie },
    next: {
      tags: ['cart'],
    },
  });
}

export const metadata = {
  title: 'Cart',
};

export default async function Page() {
  const cart = await getCart();
  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <Box>
      <Title order={2} pt="md" mb="lg">
        Cart
      </Title>
      {cart.items.length === 0 && (
        <Paper withBorder w="100%" h="400px">
          <Text fz={44} c="gray.6" fw={400} align="center" lh="400px">
            Your cart is empty
          </Text>
        </Paper>
      )}
      {cart.items.length > 0 && (
        <Flex wrap="wrap" direction="row" gap="lg" align="flex-start">
          <Paper sx={{ flex: 10 }} withBorder p="md">
            <>
              <Flex justify="space-between" align="center">
                <Text fw={600} fz={18}>
                  {cart.items.length} items
                </Text>
                <ClearCartButton />
              </Flex>
              <Divider mx="-md" my="md" />
              {cart.items.map((item) => (
                <CartItem item={item} key={item.product.id} />
              ))}
            </>
          </Paper>
          <Paper
            w={250}
            withBorder
            p="md"
            h="auto"
            sx={{
              position: 'sticky',
              top: '100px',
              flex: 1,
              minWidth: 250,
            }}
          >
            <Flex justify="space-between" align="center">
              <Text c="gray.6">Total</Text>
              <Text fz={22} fw={600}>
                {/* @ts-expect-error Server Component */}
                <Price price={total} />
              </Text>
            </Flex>
            <Divider mx="-md" my="md" />
            <Button
              component={Link}
              href="/checkout"
              variant="filled"
              size="md"
              rightIcon={<IconChevronRight />}
              radius="xl"
              w="100%"
            >
              Checkout
            </Button>
          </Paper>
        </Flex>
      )}
    </Box>
  );
}

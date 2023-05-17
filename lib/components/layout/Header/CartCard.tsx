'use client';

import { IconShoppingCart } from '@tabler/icons';
import Link from 'next/link';
import { cartsApi } from '@lib/api';
import {
  ActionIcon,
  HoverCard,
  Center,
  Text,
  Divider,
  Title,
  Group,
  Button,
  Stack,
  Indicator,
} from '@mantine/core';
import useSWR from 'swr';
import PriceClient from '@lib/components/ui/PriceClient';
import { useMemo } from 'react';
import CartCardItem from './CartCardItem';

export default function CartCard() {
  const { data: cart } = useSWR('cart', () => cartsApi.getCart());

  const items = useMemo(() => {
    return cart?.items.sort((a, b) => b.id - a.id).slice(0, 6);
  }, [cart?.items]);

  if (!cart) {
    return null;
  }

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
      <HoverCard.Target>
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
      </HoverCard.Target>
      <HoverCard.Dropdown>
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
              {items?.map((item) => (
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
                  prefetch
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
                  <PriceClient price={total} />
                </Text>
              </div>
              <Button
                radius="xl"
                size="md"
                component={Link}
                href="/cart"
                prefetch
              >
                View cart
              </Button>
            </Group>
          </>
        )}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

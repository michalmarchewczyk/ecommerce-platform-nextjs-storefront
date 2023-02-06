'use client';

import { useState } from 'react';
import { ActionIcon, Flex, NumberInput } from '@mantine/core';
import { IconShoppingCart, IconShoppingCartX, IconTrash } from '@tabler/icons';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { CartItem, cartsApi } from '@lib/api';
import { mutate } from 'swr';

export default function CartItemActions({ item }: { item: CartItem }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteFromCart = async () => {
    setLoading(true);
    const cart = await cartsApi.getCart();
    const newItems = cart.items
      .filter((i) => i.product.id !== item.product.id)
      .map((i) => ({
        quantity: i.quantity,
        productId: i.product.id,
      }));
    await cartsApi.updateCart({ cartDto: { items: newItems } });
    setLoading(false);
    router.refresh();
    await mutate('cart');
    showNotification({
      title: 'Deleted from cart',
      message: `Deleted ${item.product.name} from cart`,
      autoClose: 3000,
      icon: <IconShoppingCartX size={18} />,
    });
  };

  const updateQuantity = async (value: number) => {
    setLoading(true);
    const cart = await cartsApi.getCart();
    const newItems = cart.items.map((i) => ({
      quantity:
        i.product.id === item.product.id
          ? Math.min(item.product.stock, value)
          : i.quantity,
      productId: i.product.id,
    }));
    await cartsApi.updateCart({ cartDto: { items: newItems } });
    setLoading(false);
    router.refresh();
    await mutate('cart');
    showNotification({
      title: 'Updated quantity',
      message: `Updated quantity of ${item.product.name} to ${value}`,
      autoClose: 3000,
      icon: <IconShoppingCart size={18} />,
    });
  };

  return (
    <Flex mt={6} gap="md">
      <NumberInput
        key={item.product.id}
        radius="xl"
        size="md"
        min={1}
        max={item.product.stock}
        step={1}
        styles={{
          rightSection: { width: '40px' },
          control: { width: '39px', paddingRight: '4px' },
        }}
        w={100}
        value={item.quantity}
        disabled={loading}
        onChange={async (value) => {
          if (value) {
            await updateQuantity(value);
          }
        }}
      />
      <ActionIcon
        variant="subtle"
        size={42}
        radius="xl"
        color="gray.7"
        loading={loading}
        onClick={deleteFromCart}
      >
        <IconTrash size="24" />
      </ActionIcon>
    </Flex>
  );
}

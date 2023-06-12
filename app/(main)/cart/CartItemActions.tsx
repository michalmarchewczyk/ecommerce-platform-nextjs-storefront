'use client';

import { useTransition } from 'react';
import { ActionIcon, Flex, NumberInput } from '@mantine/core';
import { IconShoppingCart, IconShoppingCartX, IconTrash } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';
import { CartItem } from '@lib/api';
import { mutate } from 'swr';
import { deleteFromCart as deleteFromCartAction } from '@lib/actions/cart/deleteFromCart';
import { updateQuantity as updateQuantityAction } from '@lib/actions/cart/updateQuantity';

export default function CartItemActions({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();

  const deleteFromCart = async () => {
    startTransition(async () => {
      await deleteFromCartAction(item.product.id);
      await mutate('cart');
      showNotification({
        title: 'Deleted from cart',
        message: `Deleted ${item.product.name} from cart`,
        autoClose: 3000,
        icon: <IconShoppingCartX size={18} />,
      });
    });
  };

  const updateQuantity = async (value: number) => {
    startTransition(async () => {
      await updateQuantityAction(item.product.id, value, item.product.stock);
      await mutate('cart');
      showNotification({
        title: 'Updated quantity',
        message: `Updated quantity of ${item.product.name} to ${value}`,
        autoClose: 3000,
        icon: <IconShoppingCart size={18} />,
      });
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
        disabled={isPending}
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
        loading={isPending}
        onClick={deleteFromCart}
      >
        <IconTrash size="24" />
      </ActionIcon>
    </Flex>
  );
}

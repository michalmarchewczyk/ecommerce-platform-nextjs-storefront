'use client';

import { showNotification } from '@mantine/notifications';
import { IconShoppingCartOff } from '@tabler/icons';
import { useTransition } from 'react';
import { Button } from '@mantine/core';
import { mutate } from 'swr';
import { clearCart as clearCartAction } from '@lib/actions/cart/clearCart';

export default function ClearCartButton() {
  const [isPending, startTransition] = useTransition();

  const clearCart = async () => {
    startTransition(async () => {
      await clearCartAction();
      await mutate('cart');
      showNotification({
        title: 'Cleared cart',
        message: `Deleted all items from cart`,
        autoClose: 3000,
        icon: <IconShoppingCartOff size={18} />,
      });
    });
  };

  return (
    <Button
      leftIcon={<IconShoppingCartOff />}
      variant="subtle"
      radius="xl"
      size="md"
      my="-xs"
      loading={isPending}
      onClick={clearCart}
    >
      Clear cart
    </Button>
  );
}

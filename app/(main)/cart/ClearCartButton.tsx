'use client';

import { showNotification } from '@mantine/notifications';
import { IconShoppingCartOff } from '@tabler/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';
import { cartsApi } from '@lib/api';
import { mutate } from 'swr';

export default function ClearCartButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clearCart = async () => {
    setLoading(true);
    await cartsApi.updateCart({ cartDto: { items: [] } });
    setLoading(false);
    router.refresh();
    await mutate('cart');
    showNotification({
      title: 'Cleared cart',
      message: `Deleted all items from cart`,
      autoClose: 3000,
      icon: <IconShoppingCartOff size={18} />,
    });
  };

  return (
    <Button
      leftIcon={<IconShoppingCartOff />}
      variant="subtle"
      radius="xl"
      size="md"
      my="-xs"
      loading={loading}
      onClick={clearCart}
    >
      Clear cart
    </Button>
  );
}

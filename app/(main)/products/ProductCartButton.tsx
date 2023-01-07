'use client';

import { ActionIcon, Button, NumberInput } from '@mantine/core';
import { IconShoppingCartPlus } from '@tabler/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { cartsApi, Product } from '../../../lib/api';

export default function ProductCartButton({
  product,
  simple,
}: {
  product: Product;
  simple?: boolean;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addToCart = async () => {
    setLoading(true);
    const cart = await cartsApi.getCart();
    const items = cart.items.map((i) => ({
      quantity: i.quantity,
      productId: i.product.id,
    }));
    const item = items.find((i) => i.productId === product.id);
    if (item) {
      item.quantity += quantity;
    } else {
      items.push({ quantity, productId: product.id });
    }
    await cartsApi.updateCart({ cartDto: { items } });
    setLoading(false);
    router.refresh();
    showNotification({
      title: 'Added to cart',
      message: `Added ${product.name} to cart`,
      autoClose: 3000,
      icon: <IconShoppingCartPlus size={18} />,
    });
  };

  if (simple) {
    return (
      <ActionIcon
        onClick={addToCart}
        loading={loading}
        variant="filled"
        color="indigo"
        radius="xl"
        size="xl"
      >
        <IconShoppingCartPlus />
      </ActionIcon>
    );
  }

  return (
    <>
      <NumberInput
        radius="xl"
        size="lg"
        min={1}
        max={product.stock}
        step={1}
        styles={{
          rightSection: { width: '40px' },
          control: { width: '39px', paddingRight: '4px' },
        }}
        w={160}
        value={quantity}
        onChange={(value) => {
          if (value) {
            setQuantity(value);
          }
        }}
      />
      <Button
        leftIcon={<IconShoppingCartPlus />}
        radius="xl"
        size="lg"
        sx={{ flex: 1 }}
        onClick={addToCart}
        loading={loading}
      >
        Add to cart
      </Button>
    </>
  );
}

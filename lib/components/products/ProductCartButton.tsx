'use client';

import { ActionIcon, Button, NumberInput } from '@mantine/core';
import { IconShoppingCartPlus } from '@tabler/icons';
import { useState, useTransition } from 'react';
import { showNotification } from '@mantine/notifications';
import { mutate } from 'swr';
import { addToCart as addToCardAction } from '../../actions/cart/addToCart';

export default function ProductCartButton({
  productData,
  simple,
}: {
  productData: { id: number; name: string; price: number; stock: number };
  simple?: boolean;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const addToCart = async () => {
    startTransition(async () => {
      await addToCardAction(productData.id, quantity, productData.stock);
      await mutate('cart');
      showNotification({
        title: 'Added to cart',
        message: `Added ${productData.name} to cart`,
        autoClose: 3000,
        icon: <IconShoppingCartPlus size={18} />,
      });
    });
  };

  if (simple) {
    return (
      <ActionIcon
        onClick={addToCart}
        loading={isPending}
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
        max={productData.stock}
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
        loading={isPending}
      >
        Add to cart
      </Button>
    </>
  );
}

'use server';

import { cartsApi } from '@lib/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function updateQuantity(
  productId: number,
  quantity: number,
  productStock: number,
) {
  const cart = await cartsApi.getCart({
    headers: {
      'Content-Type': 'application/json',
      cookie: cookies().toString(),
    },
  });
  const newItems = cart.items.map((i) => ({
    quantity:
      i.product.id === productId
        ? Math.min(productStock, quantity)
        : i.quantity,
    productId: i.product.id,
  }));
  await cartsApi.updateCart(
    { cartDto: { items: newItems } },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
  revalidateTag('cart');
}

'use server';

import { cartsApi } from '@lib/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function deleteFromCart(productId: number) {
  const cart = await cartsApi.getCart({
    headers: {
      cookie: cookies().toString(),
    },
  });
  const newItems = cart.items
    .filter((i) => i.product.id !== productId)
    .map((i) => ({
      quantity: i.quantity,
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

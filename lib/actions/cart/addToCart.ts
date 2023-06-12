'use server';

import { cartsApi } from '@lib/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function addToCart(id: number, quantity: number, stock: number) {
  const cart = await cartsApi.getCart({
    headers: {
      cookie: cookies().toString(),
    },
  });
  const items = cart.items.map((i) => ({
    quantity: i.quantity,
    productId: i.product.id,
  }));
  const item = items.find((i) => i.productId === id);
  if (item) {
    item.quantity = Math.min(stock, item.quantity + quantity);
  } else {
    items.push({ quantity, productId: id });
  }
  await cartsApi.updateCart(
    { cartDto: { items } },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
  revalidateTag('cart');
}

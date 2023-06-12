'use server';

import { cartsApi } from '@lib/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function clearCart() {
  await cartsApi.updateCart(
    { cartDto: { items: [] } },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
  revalidateTag('cart');
}

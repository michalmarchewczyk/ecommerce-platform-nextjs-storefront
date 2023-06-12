'use server';

import { cartsApi, OrderCreateDto, ordersApi } from '@lib/api';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function createOrder(orderDto: OrderCreateDto) {
  const order = await ordersApi.createOrder(
    {
      orderCreateDto: orderDto,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
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
  return order.id;
}

'use server';

import { revalidateTag } from 'next/cache';
import { returnsApi } from '@lib/api';
import { cookies } from 'next/headers';

export async function createReturn(orderId: number, message: string) {
  await returnsApi.createReturn(
    {
      returnCreateDto: { orderId, message },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
  revalidateTag('orders');
}

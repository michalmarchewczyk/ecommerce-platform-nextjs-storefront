'use server';

import { wishlistsApi } from '@lib/api';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function createWishlist(name: string) {
  await wishlistsApi.createWishlist(
    {
      wishlistCreateDto: {
        name,
        productIds: [],
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        cookie: cookies().toString(),
      },
    },
  );
  revalidateTag('wishlists');
}

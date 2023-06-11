'use server';

import { wishlistsApi } from '@lib/api';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function addToWishlist(wishlistId: number, productId: number) {
  const userWishlists = await wishlistsApi.getUserWishlists({
    headers: {
      'Content-Type': 'application/json',
      cookie: cookies().toString(),
    },
  });
  const wishlist = userWishlists.find((w) => w.id === wishlistId);
  if (!wishlist) {
    return;
  }
  const newProductIds = wishlist.products.map((product) => product.id);
  newProductIds?.push(productId);
  await wishlistsApi.updateWishlist(
    {
      id: wishlistId,
      wishlistUpdateDto: { productIds: newProductIds },
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

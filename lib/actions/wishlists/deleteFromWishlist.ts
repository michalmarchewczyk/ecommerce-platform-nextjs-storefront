'use server';

import { wishlistsApi } from '@lib/api';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

export async function deleteFromWishlist(
  wishlistId: number,
  productId: number,
) {
  const wishlists = await wishlistsApi.getUserWishlists({
    headers: {
      'Content-Type': 'application/json',
      cookie: cookies().toString(),
    },
  });
  const wishlist = wishlists.find((w) => w.id === wishlistId);
  if (!wishlist) {
    return;
  }
  const newProductIds = wishlist.products
    .map((p) => p.id)
    .filter((id) => id !== productId);
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

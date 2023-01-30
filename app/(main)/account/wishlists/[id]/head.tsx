import { headers } from 'next/headers';
import { wishlistsApi } from '@lib/api';

async function getWishlist(id: number) {
  const cookie = headers().get('cookie') ?? '';
  const wishlists = await wishlistsApi.getUserWishlists({
    cache: 'no-store',
    headers: { cookie },
  });
  return wishlists.find((wishlist) => wishlist.id === id);
}

export default async function Head({
  params: { id },
}: {
  params: { id: string };
}) {
  const wishlist = await getWishlist(parseInt(id, 10));
  if (!wishlist) {
    return null;
  }
  const title = `${wishlist.name} - Ecommerce Platform`;

  return (
    <>
      <title>{title}</title>
    </>
  );
}

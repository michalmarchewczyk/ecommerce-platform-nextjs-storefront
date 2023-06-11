import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons';
import { Button, Center, Text, Title } from '@lib/components/wrappers';
import { wishlistsApi } from '@lib/api';
import WishlistProduct from './WishlistProduct';

async function getWishlist(id: number) {
  const cookie = headers().get('cookie') ?? '';
  const wishlists = await wishlistsApi.getUserWishlists({
    cache: 'no-store',
    headers: { cookie },
    next: {
      tags: ['wishlists'],
    },
  });
  return wishlists.find((wishlist) => wishlist.id === id);
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return {};
  const wishlist = await getWishlist(parseInt(id, 10));

  return { title: wishlist?.name };
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const wishlist = await getWishlist(parseInt(id, 10));
  if (!wishlist) {
    return notFound();
  }

  return (
    <>
      <Button
        variant="outline"
        component={Link}
        href="/account/wishlists"
        radius="xl"
        mb="xl"
        leftIcon={<IconArrowLeft />}
      >
        View all wishlists
      </Button>
      <Title order={2} mb="md">
        {wishlist.name}
      </Title>
      {wishlist.products.length === 0 && (
        <Center mih={200}>
          <Text fz={36} fw={400} c="gray.6">
            No products found
          </Text>
        </Center>
      )}
      {wishlist.products.map((product) => (
        <WishlistProduct
          key={product.id}
          product={product}
          wishlistId={wishlist.id}
        />
      ))}
    </>
  );
}

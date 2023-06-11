import { headers } from 'next/headers';
import { Center, Flex, Text, Title } from '@lib/components/wrappers';
import { wishlistsApi } from '@lib/api';
import WishlistsListItem from './WishlistsListItem';

async function getUserWishlists() {
  const cookie = headers().get('cookie') ?? '';
  const wishlists = await wishlistsApi.getUserWishlists({
    cache: 'no-store',
    headers: { cookie },
    next: {
      tags: ['wishlists'],
    },
  });
  return wishlists.map((wishlist) => ({
    ...wishlist,
    products: wishlist.products.slice(0, 5),
    countProducts: wishlist.products.length,
  }));
}

export const metadata = {
  title: 'Wishlists',
};

export default async function Page() {
  const wishlists = await getUserWishlists();
  return (
    <>
      <Title order={2} mb="md">
        My wishlists
      </Title>
      <Flex direction="column" gap="md">
        {wishlists.length === 0 && (
          <Center mih={200}>
            <Text fz={40} fw={400} c="gray.6">
              No wishlists found
            </Text>
          </Center>
        )}
        {wishlists.map((wishlist) => (
          <div key={wishlist.id}>
            <WishlistsListItem wishlist={wishlist} />
          </div>
        ))}
      </Flex>
    </>
  );
}

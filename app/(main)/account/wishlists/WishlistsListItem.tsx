import Image from 'next/image';
import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { Box, Center, Flex, Paper, Text } from '@lib/components/wrappers';
import { API_URL, Wishlist } from '@lib/api';

export default function WishlistsListItem({
  wishlist,
}: {
  wishlist: Wishlist & { countProducts: number };
}) {
  const products = wishlist.products.map((product) => {
    const photoId = product.photosOrder
      ? parseInt(product.photosOrder.split(',')[0], 10)
      : product.photos[0]?.id;
    const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;
    return photoId ? (
      <Image
        key={product.id}
        src={photoUrl}
        width={40}
        height={40}
        alt=""
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: 'var(--mantine-radius-md)',
        }}
      />
    ) : (
      <Center
        key={product.id}
        w={40}
        h={40}
        sx={{
          backgroundColor: 'var(--mantine-color-gray-2)',
          color: 'var(--mantine-color-gray-6)',
          borderRadius: 'var(--mantine-radius-md)',
        }}
      >
        <IconPackage size={30} strokeWidth={1} />
      </Center>
    );
  });

  return (
    <Paper
      withBorder
      p="md"
      pt="xs"
      component={Link}
      href={`/account/wishlists/${wishlist.id}`}
      sx={{
        transition: 'box-shadow 0.2s var(--mantine-transition-timing-function)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 'var(--mantine-shadow-md)',
        },
      }}
    >
      <Flex align="center" gap="md">
        <Text fw={600} fz={20}>
          {wishlist.name}
        </Text>
        <Box sx={{ flex: 1 }} />
        <Text fw={500} fz={16} c="gray.6">
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(wishlist.created))}
        </Text>
      </Flex>
      <Flex direction="row" gap="md" align="flex-end" mt="xs">
        {products}
        {wishlist.products.length < wishlist.countProducts && (
          <Center w={60} h={40}>
            <Text fw={500} fz={16} color="gray.7">
              +{wishlist.countProducts - wishlist.products.length} more
            </Text>
          </Center>
        )}
      </Flex>
    </Paper>
  );
}

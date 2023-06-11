'use client';

import { IconPackage, IconTrash } from '@tabler/icons';
import Link from 'next/link';
import Image from 'next/image';
import { ActionIcon, Box, Center, Flex, Text } from '@mantine/core';
import { useTransition } from 'react';
import { API_URL, Product } from '@lib/api';
import PriceClient from '@lib/components/ui/PriceClient';
import { deleteFromWishlist as deleteFromWishlistAction } from '@lib/actions/wishlists/deleteFromWishlist';

export default function WishlistProduct({
  product,
  wishlistId,
}: {
  product: Product;
  wishlistId: number;
}) {
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;

  const [isPending, startTransition] = useTransition();

  const deleteFromWishlist = async () => {
    startTransition(async () => {
      await deleteFromWishlistAction(wishlistId, product.id);
    });
  };

  return (
    <Flex
      direction="row"
      gap="md"
      p={10}
      px={8}
      align="center"
      sx={{
        borderRadius: 'var(--mantine-radius-md)',
        border: '1px solid transparent',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          border: '1px solid var(--mantine-color-gray-4)',
          '> div:nth-child(3)': {
            textDecoration: 'underline',
          },
        },
        '&:not(:last-child)': {
          marginBottom: 'var(--mantine-spacing-md)',
        },
        '&:not(:last-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          bottom: -10,
          height: 1,
          left: 0,
          right: 0,
          backgroundColor: 'var(--mantine-color-gray-4)',
        },
      }}
    >
      <Box
        component={Link}
        href={`/products/${product.id}`}
        target="_blank"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 100,
          zIndex: 10,
        }}
      />
      {photoId ? (
        <Image
          src={photoUrl}
          width={60}
          height={60}
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
          w={60}
          h={60}
          sx={{
            backgroundColor: 'var(--mantine-color-gray-2)',
            color: 'var(--mantine-color-gray-6)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <IconPackage size={30} strokeWidth={1} />
        </Center>
      )}
      <div>
        <Text fz={20} fw={600} lineClamp={1} mb={0}>
          {product.name}
        </Text>
        <Text fz={18} fw={500} c="gray.7">
          <PriceClient price={product.price} />
        </Text>
      </div>
      <Box sx={{ flex: 1 }} />
      <Flex direction="row" align="center" gap="sm" sx={{ zIndex: 20 }}>
        <ActionIcon
          variant="subtle"
          size={42}
          radius="xl"
          color="gray.7"
          loading={isPending}
          onClick={deleteFromWishlist}
        >
          <IconTrash size="24" />
        </ActionIcon>
      </Flex>
    </Flex>
  );
}

'use client';

import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { Box, Center, Flex, Text } from '@mantine/core';
import Image from 'next/image';
import { API_URL, CartItem as CartItemModel } from '@lib/api';
import PriceClient from '@lib/components/ui/PriceClient';

const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function CheckoutItem({ item }: { item: CartItemModel }) {
  const { product } = item;
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;

  return (
    <Flex
      direction="row"
      gap="md"
      p={2}
      px={16}
      align="center"
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:not(:last-child)': {
          marginBottom: 'var(--mantine-spacing-md)',
        },
      }}
    >
      <Box
        component={Link}
        href={`/products/${item.product.id}`}
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
          loader={imageLoader}
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
      )}
      <div>
        <Text fz={18} fw={600} lineClamp={1}>
          {item.quantity} x {product.name}
        </Text>
      </div>
      <Box sx={{ flex: 1 }} />
      <Flex direction="column" align="flex-end" gap="sm" sx={{ zIndex: 20 }}>
        <Text fz={20} fw={600} lineClamp={1} sx={{ whiteSpace: 'nowrap' }}>
          <PriceClient price={item.quantity * product.price} />
        </Text>
      </Flex>
    </Flex>
  );
}

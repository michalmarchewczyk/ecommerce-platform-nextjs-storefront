'use client';

import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, CartItem } from '@lib/api';
import PriceClient from '@lib/components/ui/PriceClient';
import { Center, Flex, Text } from '../../wrappers';

const imageLoader = ({ src }: { src: string }) => {
  return src;
};

export default function CartCardItem({ item }: { item: CartItem }) {
  const { product } = item;
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;

  return (
    <Link href={`/products/${product.id}`}>
      <Flex
        direction="row"
        gap="md"
        p={10}
        sx={{
          borderRadius: 'var(--mantine-radius-md)',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-2)',
          },
        }}
      >
        {photoId ? (
          <Image
            loader={imageLoader}
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
            <IconPackage size={40} strokeWidth={1} />
          </Center>
        )}
        <div>
          <Text fz={18} fw={600} lineClamp={1}>
            {product.name}
          </Text>
          <Text fz={16} fw={500} c="gray.7">
            {item.quantity}&nbsp;x&nbsp;
            <PriceClient price={product.price} />
          </Text>
        </div>
      </Flex>
    </Link>
  );
}

'use client';

import { Button, Flex, Text } from '@mantine/core';
import { IconHeartPlus } from '@tabler/icons';
import { Product } from '../../../lib/api';
import ProductShareButton from './ProductShareButton';
import ProductCartButton from './ProductCartButton';

export default function ProductActions({ product }: { product: Product }) {
  return (
    <>
      <Flex gap="md" mb="lg">
        <ProductCartButton product={product} />
      </Flex>
      <Flex align="center" gap="md" wrap="wrap">
        <Text sx={{ flex: 1 }} c="gray.7" fw={500} fz={18}>
          {product.stock}&nbsp;in&nbsp;stock
        </Text>
        <Button
          leftIcon={<IconHeartPlus />}
          radius="xl"
          size="lg"
          variant="outline"
        >
          Save
        </Button>
        <ProductShareButton productId={product.id} />
      </Flex>
    </>
  );
}

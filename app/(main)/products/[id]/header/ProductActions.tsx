'use client';

import { Flex, Text } from '@mantine/core';
import { Product } from '@lib/api';
import ProductCartButton from '@lib/components/products/ProductCartButton';
import ProductShareButton from './ProductShareButton';
import ProductWishlistButton from './ProductWishlistButton';

export default function ProductActions({ product }: { product: Product }) {
  return (
    <>
      <Flex gap="md" mb="lg">
        <ProductCartButton
          productData={{
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
          }}
        />
      </Flex>
      <Flex align="center" gap="md" wrap="wrap">
        <Text sx={{ flex: 1 }} c="gray.7" fw={500} fz={18}>
          {product.stock}&nbsp;in&nbsp;stock
        </Text>
        <ProductWishlistButton productId={product.id} />
        <ProductShareButton productId={product.id} />
      </Flex>
    </>
  );
}

'use client';

import { Button, Flex, NumberInput, Text } from '@mantine/core';
import { IconHeartPlus, IconShoppingCartPlus } from '@tabler/icons';
import { Product } from '../../../lib/api';
import ProductShareButton from './ProductShareButton';

export default function ProductActions({ product }: { product: Product }) {
  return (
    <>
      <Flex gap="md" mb="lg">
        <NumberInput
          radius="xl"
          size="lg"
          defaultValue={1}
          min={1}
          max={product.stock}
          step={1}
          styles={{
            rightSection: { width: '40px' },
            control: { width: '39px', paddingRight: '4px' },
          }}
          w={160}
        />
        <Button
          leftIcon={<IconShoppingCartPlus />}
          radius="xl"
          size="lg"
          sx={{ flex: 1 }}
        >
          Add to cart
        </Button>
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
        <ProductShareButton />
      </Flex>
    </>
  );
}

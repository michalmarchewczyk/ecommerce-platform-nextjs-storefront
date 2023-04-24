import Link from 'next/link';
import { IconX } from '@tabler/icons';
import { Box, Button, Card, Text } from '@lib/components/wrappers';
import { AttributeType, categoriesApi } from '@lib/api';
import CategoryFilterGroup from './CategoryFilterGroup';
import CategoryPriceFilter from './CategoryPriceFilter';

type AttributeTypeWithValues = AttributeType & { values: Set<string> };

async function getAttributeTypes(categoryId: number) {
  const products = await categoriesApi.getCategoryProducts({ id: categoryId });
  const attributeTypes: AttributeTypeWithValues[] = [];
  const priceMin = Math.min(...products.map((p) => p.price));
  const priceMax = Math.max(...products.map((p) => p.price));
  products.forEach((product) => {
    product.attributes.forEach((attribute) => {
      let attributeType: AttributeTypeWithValues | undefined =
        attributeTypes.find((a) => a.id === attribute.type.id);
      if (!attributeType) {
        attributeType = { ...attribute.type, values: new Set() };
        attributeTypes.push(attributeType);
      }
      attributeType.values.add(attribute.value);
    });
  });
  return {
    attributeTypes: attributeTypes.map((t) => ({
      ...t,
      values: Array.from(t.values),
    })),
    priceMin,
    priceMax,
  };
}

export default async function CategoryFilter({
  categoryId,
}: {
  categoryId: number;
}) {
  const { attributeTypes, priceMin, priceMax } = await getAttributeTypes(
    categoryId,
  );

  return (
    <Card withBorder w={250} py="sm" px="md">
      <Box mb="lg">
        <Text>Price</Text>
        <CategoryPriceFilter priceMin={priceMin} priceMax={priceMax} />
      </Box>
      {attributeTypes.map((attributeType) => (
        <Box key={attributeType.id} mb="md">
          <Text>{attributeType.name}</Text>
          <CategoryFilterGroup
            categoryId={categoryId}
            attributeType={attributeType}
          />
        </Box>
      ))}
      <Button
        mt="xs"
        leftIcon={<IconX />}
        component={Link}
        href={`/categories/${categoryId}`}
        variant="light"
        w="100%"
        prefetch
      >
        Clear filters
      </Button>
    </Card>
  );
}

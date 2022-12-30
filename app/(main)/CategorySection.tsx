import { IconArrowRight } from '@tabler/icons';
import Link from 'next/link';
import { categoriesApi } from '../../lib/api';
import {
  Box,
  Button,
  Carousel,
  CarouselSlide,
  Group,
  Title,
} from '../../lib/components/wrappers';
import ProductCard from './ProductCard';

async function getCategory(categoryId: number) {
  return categoriesApi.getCategory({ id: categoryId });
}

async function getCategoryProducts(categoryId: number) {
  return categoriesApi.getCategoryProducts({ id: categoryId });
}

export default async function CategorySection({
  categoryId,
}: {
  categoryId: number;
}) {
  const [category, products] = await Promise.all([
    getCategory(categoryId),
    getCategoryProducts(categoryId),
  ]);

  if (!category || !products || products.length === 0) {
    return null;
  }

  return (
    <Box component="section" mt="xl" pt="lg">
      <Group>
        <Title order={2} fz={24}>
          {category.name}
        </Title>
        <Button
          variant="outline"
          rightIcon={<IconArrowRight />}
          component={Link}
          href={`/categories/${category.id}`}
        >
          View All Products
        </Button>
      </Group>
      <Box mt="lg">
        <Carousel
          height={400}
          slideSize="20%"
          align="start"
          slideGap={0}
          controlSize={30}
          draggable={false}
          slidesToScroll={2}
          controlsOffset={20}
          containScroll="trimSnaps"
          mx={-10}
          breakpoints={[{ maxWidth: 1320, slideSize: 260 }]}
          styles={{
            control: {
              marginTop: -40,
              '&[data-inactive]': {
                opacity: 0,
                cursor: 'default',
                pointerEvents: 'none',
              },
            },
          }}
        >
          {products.map((product) => (
            <CarouselSlide key={product.id}>
              {/* @ts-expect-error Server Component */}
              <ProductCard productId={product.id} />
            </CarouselSlide>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}

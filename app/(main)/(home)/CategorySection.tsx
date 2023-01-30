import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons';
import Link from 'next/link';
import { categoriesApi } from '@lib/api';
import {
  Box,
  Button,
  Carousel,
  CarouselSlide,
  Group,
  Title,
} from '@lib/components/wrappers';
import ProductCard from '@lib/components/products/ProductCard';

async function getCategory(categoryId: number) {
  return categoriesApi.getCategory({ id: categoryId });
}

async function getCategoryProducts(categoryId: number) {
  const products = await categoriesApi.getCategoryProducts({ id: categoryId });
  return products.slice(0, 10);
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
          radius="xl"
          rightIcon={<IconArrowRight />}
          component={Link}
          href={`/categories/${category.id}`}
          sx={{ marginTop: 1 }}
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
          controlSize={36}
          draggable
          slidesToScroll={2}
          controlsOffset={20}
          containScroll="trimSnaps"
          mx={-16}
          breakpoints={[{ maxWidth: 1320, slideSize: 260 }]}
          nextControlIcon={<IconChevronRight size={24} />}
          previousControlIcon={<IconChevronLeft size={24} />}
          styles={{
            control: {
              marginTop: -40,
              color: 'var(--mantine-color-indigo-7)',
              '&[data-inactive]': {
                opacity: 0,
                cursor: 'default',
                pointerEvents: 'none',
              },
            },
            viewport: {
              paddingLeft: '6px',
              paddingRight: '6px',
            },
          }}
        >
          {products.map((product) => (
            <CarouselSlide key={product.id}>
              <ProductCard product={product} />
            </CarouselSlide>
          ))}
          {products.length > 5 && (
            <CarouselSlide>
              <Button
                variant="outline"
                w={240}
                h={370}
                rightIcon={<IconArrowRight />}
                component={Link}
                href={`/categories/${category.id}`}
                ml={10}
                size="lg"
              >
                View all products
              </Button>
            </CarouselSlide>
          )}
        </Carousel>
      </Box>
    </Box>
  );
}

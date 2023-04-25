import { categoriesApi } from '@lib/api';
import { Box, Flex, Space, Title } from '@lib/components/wrappers';
import CategoriesTree from './CategoriesTree';
import CategoryFilter from './CategoryFilter';
import CategoryDrawer from './CategoryDrawer';

async function getCategory(id: number) {
  return categoriesApi.getCategory(
    { id },
    {
      next: {
        revalidate: 60,
      },
    },
  );
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return {};
  const category = await getCategory(parseInt(id, 10));

  return { title: category.name };
}

export default async function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return null;
  const category = await getCategory(parseInt(id, 10));

  return (
    <Flex
      wrap="wrap"
      direction="row"
      gap="lg"
      sx={{ '@media (max-width: 850px)': { gap: 0 } }}
    >
      <Title order={2} mb="xs" pt="md" w="100%">
        {category.name}
      </Title>
      <Flex
        w={250}
        direction="column"
        gap="md"
        sx={{ '@media (max-width: 850px)': { display: 'none' } }}
      >
        {/* @ts-expect-error Server Component */}
        <CategoriesTree categoryId={category.id} />
        {/* @ts-expect-error Server Component */}
        <CategoryFilter categoryId={category.id} />
      </Flex>
      <Box sx={{ flex: 1 }}>{children}</Box>
      <Box sx={{ '@media (min-width: 851px)': { display: 'none' } }}>
        <CategoryDrawer>
          {/* @ts-expect-error Server Component */}
          <CategoriesTree categoryId={category.id} />
          <Space h="md" />
          {/* @ts-expect-error Server Component */}
          <CategoryFilter categoryId={category.id} />
        </CategoryDrawer>
      </Box>
    </Flex>
  );
}

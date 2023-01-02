import { categoriesApi } from '../../../../lib/api';
import { Box, Flex, Title } from '../../../../lib/components/wrappers';
import CategoriesTree from '../CategoriesTree';
import CategoryFilter from '../CategoryFilter';

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

export default async function Layout({
  params: { id },
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const category = await getCategory(parseInt(id, 10));

  return (
    <Flex wrap="wrap" direction="row" gap="lg">
      <Title order={2} mb="xs" pt="md" w="100%">
        {category.name}
      </Title>
      <Flex w={250} direction="column" gap="md">
        {/* @ts-expect-error Server Component */}
        <CategoriesTree categoryId={category.id} />
        {/* @ts-expect-error Server Component */}
        <CategoryFilter categoryId={category.id} />
      </Flex>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Flex>
  );
}

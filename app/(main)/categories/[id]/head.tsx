import { categoriesApi } from '@lib/api';

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
export default async function Head({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return null;
  const category = await getCategory(parseInt(id, 10));
  const title = `${category.name} - Ecommerce Platform`;

  return (
    <>
      <title>{title}</title>
    </>
  );
}

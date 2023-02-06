import { pagesApi } from '@lib/api';

async function getPage(id: number) {
  return pagesApi.getPage({ id });
}
export default async function Head({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return null;
  const page = await getPage(parseInt(id, 10));
  const title = `${page.title} - Ecommerce Platform`;

  return (
    <>
      <title>{title}</title>
    </>
  );
}

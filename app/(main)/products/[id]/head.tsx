import { productsApi } from '@lib/api';

async function getProduct(id: number) {
  return productsApi.getProduct({ id });
}
export default async function Head({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(parseInt(id, 10));
  const title = `${product.name} - Ecommerce Platform`;

  return (
    <>
      <title>{title}</title>
    </>
  );
}

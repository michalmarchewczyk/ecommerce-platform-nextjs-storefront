import { categoriesApi, Product } from '@lib/api';
import {
  Center,
  Divider,
  Flex,
  Skeleton,
  Text,
} from '@lib/components/wrappers';
import ProductCard from '@lib/components/products/ProductCard';
import { Suspense } from 'react';
import styles from './page.module.scss';
import CategoryControls from './CategoryControls';
import CategoryPagination from './CategoryPagination';

// export const revalidate = 30;
// export const dynamic = 'force-static';

const PAGE_SIZE = 12;

type sortMethod =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'date-asc'
  | 'date-desc';

async function getProducts(
  categoryId: number,
  page: number,
  sort: sortMethod,
  priceMin: number | undefined,
  priceMax: number | undefined,
  attributesFilter: Record<string, string[]>,
): Promise<[Product[], number]> {
  let products = await categoriesApi.getCategoryProducts(
    { id: categoryId },
    {
      next: {
        revalidate: 60,
      },
    },
  );
  products.sort((a, b) => {
    if (sort.startsWith('price')) {
      return a.price - b.price;
    }
    if (sort.startsWith('name')) {
      return a.name.localeCompare(b.name);
    }
    if (sort.startsWith('date')) {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    }
    return 0;
  });
  if (sort.endsWith('desc')) {
    products.reverse();
  }
  if (priceMin) {
    products = products.filter((p) => p.price >= priceMin);
  }
  if (priceMax) {
    products = products.filter((p) => p.price <= priceMax);
  }
  Object.entries(attributesFilter).forEach(([attributeTypeId, values]) => {
    products = products.filter((p) =>
      p.attributes.some(
        (a) =>
          a.type.id.toString() === attributeTypeId && values.includes(a.value),
      ),
    );
  });
  return [
    products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    products.length,
  ];
}

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return null;
  const sort = (searchParams?.sort as sortMethod) ?? 'price-asc';
  const page = searchParams?.page
    ? parseInt(searchParams.page as string, 10)
    : 1;
  const priceMin = searchParams?.priceMin
    ? parseInt(searchParams.priceMin as string, 10)
    : undefined;
  const priceMax = searchParams?.priceMax
    ? parseInt(searchParams.priceMax as string, 10)
    : undefined;
  const attributesFilter = Object.fromEntries(
    Object.entries(searchParams ?? {})
      .filter(
        ([key]) => !['sort', 'page', 'priceMin', 'priceMax'].includes(key),
      )
      .map(([key, value]) =>
        Array.isArray(value) ? [key, value] : [key, [value]],
      ) as [string, string[]][],
  );
  const [products, countProducts] = await getProducts(
    parseInt(id, 10),
    page,
    sort,
    priceMin,
    priceMax,
    attributesFilter,
  );

  if (countProducts === 0) {
    return (
      <Center mih={200}>
        <Text fz={48} fw={400} c="gray.6">
          No products found
        </Text>
      </Center>
    );
  }

  return (
    <>
      {/*<Suspense fallback={<div>LOADING...</div>}>*/}
      <CategoryControls countProducts={countProducts} />
      {/*</Suspense>*/}
      <Divider my="md" />
      <Flex
        wrap="wrap"
        gap="md"
        justify="space-evenly"
        className={styles.container}
      >
        {products.map((product) => (
          <div key={product.id}>
            <Suspense fallback={<Skeleton w={240} h={370} />}>
              <ProductCard product={product} />
            </Suspense>
          </div>
        ))}
      </Flex>
      <Divider mb="xs" />
      {/*<Suspense fallback={<div>LOADING...</div>}>*/}
      <CategoryPagination countProducts={countProducts} />
      {/*</Suspense>*/}
    </>
  );
}

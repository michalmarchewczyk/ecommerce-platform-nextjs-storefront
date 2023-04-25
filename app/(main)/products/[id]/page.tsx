import { Suspense } from 'react';
import {
  IconAlignJustified,
  IconList,
  IconPhoto,
  IconStar,
} from '@tabler/icons';
import { productRatingsApi, productsApi } from '@lib/api';
import { AspectRatio, Box, Divider, Flex } from '@lib/components/wrappers';
import PageNavigation from '@lib/components/ui/PageNavigation';
import ProductPhotos from './header/ProductPhotos';
import ProductHeader from './header/ProductHeader';
import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';
import ProductRatings from './ratings/ProductRatings';
import ProductRatingsLoading from './ratings/ProductRatingsLoading';

export const dynamic = 'force-static';

async function getProduct(id: number) {
  return productsApi.getProduct({ id });
}

async function getProductRatings(id: number) {
  const ratings = await productRatingsApi.getProductRatings(
    { productId: id },
    {
      next: { revalidate: 1 },
    },
  );
  const average =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const count = ratings.length;
  return { average, count };
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return {};
  const product = await getProduct(parseInt(id, 10));

  return { title: product.name };
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return null;
  const productId = parseInt(id, 10);
  const [product, ratings] = await Promise.all([
    getProduct(productId),
    getProductRatings(productId),
  ]);

  return (
    <Box pt={30}>
      <Flex direction="row" wrap="wrap" gap={36} justify="center">
        <AspectRatio ratio={4 / 3} sx={{ flex: 1 }} miw={400} maw={600}>
          {/* @ts-expect-error Server Component */}
          <ProductPhotos id={product.id} />
        </AspectRatio>
        <ProductHeader product={product} ratings={ratings} />
      </Flex>
      <Flex direction="row" gap={40} wrap="wrap" w="100%">
        <Box
          w={180}
          miw={180}
          pt={56}
          sx={{
            '@media (max-width: 750px)': {
              minWidth: '100%',
              position: 'sticky',
              top: '32px',
              marginBottom: '-64px',
              zIndex: 100,
            },
          }}
        >
          <PageNavigation
            items={[
              {
                label: 'Photos',
                icon: <IconPhoto size={24} />,
                value: '',
              },
              {
                label: 'Description',
                icon: <IconAlignJustified size={24} />,
                value: 'description',
              },
              {
                label: 'Details',
                icon: <IconList size={24} />,
                value: 'details',
              },
              {
                label: 'Ratings',
                icon: <IconStar size={24} />,
                value: 'ratings',
              },
            ]}
          />
        </Box>
        <Box
          pt={32}
          sx={{
            flex: 1,
            '@media (max-width: 750px)': {
              paddingLeft: '16px',
              paddingRight: '16px',
            },
          }}
        >
          <ProductDescription product={product} />
          <Divider mt={60} />
          <ProductDetails product={product} />
          <Divider mt={60} />
          <Suspense fallback={<ProductRatingsLoading />}>
            {/* @ts-expect-error Server Component */}
            <ProductRatings product={product} />
          </Suspense>
        </Box>
      </Flex>
    </Box>
  );
}

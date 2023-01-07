import { productRatingsApi, productsApi } from '../../../../lib/api';
import ProductPhotos from '../ProductPhotos';
import {
  AspectRatio,
  Box,
  Divider,
  Flex,
} from '../../../../lib/components/wrappers';
import ProductHeader from '../ProductHeader';
import ProductDescription from '../ProductDescription';
import ProductDetails from '../ProductDetails';
import ProductNavigation from '../ProductNavigation';
import ProductRatings from '../ProductRatings';

// export async function generateStaticParams() {
//   const products = await productsApi.getProducts();
//   return products.map((product) => ({
//     id: product.id.toString(),
//   }));
// }

async function getProduct(id: number) {
  return productsApi.getProduct({ id });
}

async function getProductRatings(id: number) {
  const ratings = await productRatingsApi.getProductRatings({ productId: id });
  const average =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const count = ratings.length;
  return { average, count };
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
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
      <Flex direction="row" gap={40} wrap="wrap">
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
            },
          }}
        >
          <ProductNavigation />
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
          <ProductRatings product={product} />
        </Box>
      </Flex>
    </Box>
  );
}

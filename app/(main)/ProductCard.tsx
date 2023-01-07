import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { productRatingsApi, productsApi } from '../../lib/api';
import {
  Card,
  CardSection,
  Image,
  Text,
  Rating,
  Flex,
  Center,
} from '../../lib/components/wrappers';
import styles from './ProductCard.module.scss';
import Price from './products/Price';

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

export default async function ProductCard({
  productId,
}: {
  productId: number;
}) {
  const [product, ratings] = await Promise.all([
    getProduct(productId),
    getProductRatings(productId),
  ]);
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `http://localhost/products/${product.id}/photos/${photoId}?thumbnail=false`;

  return (
    <Card
      w={240}
      p="lg"
      mx="auto"
      mah={370}
      h={370}
      className={styles.card}
      component={Link}
      href={`/products/${product.id}`}
    >
      <CardSection h={236} px={2} className={styles.photo}>
        {photoId ? (
          <Image src={photoUrl} />
        ) : (
          <Center className={styles.photoPlaceholder}>
            <IconPackage size={120} strokeWidth={0.8} />
          </Center>
        )}
      </CardSection>
      <Text fz="md" fw={500} mt="sm" lineClamp={2}>
        {product.name}
      </Text>
      <Flex align="center">
        <Rating value={ratings.average} fractions={2} readOnly />
        <Text fw={400} fz="md" ml={4} c="gray.7">
          ({ratings.count})
        </Text>
      </Flex>
      <Text fz={24} fw={600} sx={{ position: 'absolute', bottom: 8 }}>
        {/* @ts-expect-error Server Component */}
        <Price price={product.price} />
      </Text>
    </Card>
  );
}

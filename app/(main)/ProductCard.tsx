import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { Suspense } from 'react';
import { Product } from '../../lib/api';
import {
  Card,
  CardSection,
  Image,
  Text,
  Center,
  Box,
  Skeleton,
} from '../../lib/components/wrappers';
import styles from './ProductCard.module.scss';
import Price from './products/Price';
import ProductCartButton from './products/ProductCartButton';
import ProductRating from './ProductRating';

export default function ProductCard({ product }: { product: Product }) {
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `http://localhost/products/${product.id}/photos/${photoId}?thumbnail=false`;

  return (
    <Card
      w={240}
      p="lg"
      pt={0}
      mx="auto"
      mah={370}
      h={370}
      className={styles.card}
    >
      <CardSection h={236} px={2} className={styles.photo}>
        {photoId ? (
          <Image
            src={photoUrl}
            mah="100%"
            maw="100%"
            fit="contain"
            width={234}
            height={236}
          />
        ) : (
          <Center className={styles.photoPlaceholder}>
            <IconPackage size={120} strokeWidth={0.8} />
          </Center>
        )}
      </CardSection>
      <Text fz="md" fw={500} mt="sm" lineClamp={2}>
        {product.name}
      </Text>
      <Suspense fallback={<Skeleton height={22} width={125} mt={2} />}>
        {/* @ts-expect-error Server Component */}
        <ProductRating productId={product.id} />
      </Suspense>
      <Text fz={24} fw={600} sx={{ position: 'absolute', bottom: 8 }}>
        {/* @ts-expect-error Server Component */}
        <Price price={product.price} />
      </Text>
      <Box className={styles.cartButton}>
        <ProductCartButton product={product} simple />
      </Box>
      <Link href={`/products/${product.id}`} className={styles.link} />
    </Card>
  );
}

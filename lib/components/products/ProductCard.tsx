import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { Suspense } from 'react';
import Image from 'next/image';
import { API_URL, Product } from '@lib/api';
import Price from '@lib/components/ui/Price';
import { Card, CardSection, Text, Center, Box, Skeleton } from '../wrappers';
import styles from './ProductCard.module.scss';
import ProductCartButton from './ProductCartButton';
import ProductRating from './ProductRating';

export default function ProductCard({ product }: { product: Product }) {
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;
  const photo = product.photos.find((p) => p.id === photoId);

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
            width={234}
            height={236}
            alt=""
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
            priority
            placeholder="blur"
            blurDataURL={photo?.placeholderBase64}
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
        <ProductCartButton
          productData={{
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
          }}
          simple
        />
      </Box>
      <Link href={`/products/${product.id}`} className={styles.link} prefetch />
    </Card>
  );
}

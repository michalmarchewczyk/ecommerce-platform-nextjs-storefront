import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import {
  Carousel,
  CarouselSlide,
  Image,
  Paper,
} from '../../../lib/components/wrappers';
import { productsApi } from '../../../lib/api';
import ProductNavigationAnchor from './ProductNavigationAnchor';

async function getProductPhotosUrls(id: number) {
  const product = await productsApi.getProduct({ id });
  let { photos } = product;
  if (product.photosOrder) {
    const photosOrder = product.photosOrder
      .split(',')
      .map((i) => parseInt(i, 10));
    photos = photos.sort((a, b) => {
      return photosOrder.indexOf(a.id) - photosOrder.indexOf(b.id);
    });
  }
  return photos.map(
    (photo) => `http://localhost/products/${product.id}/photos/${photo.id}`,
  );
}

export default async function ProductPhotos({ id }: { id: number }) {
  const photosUrls = await getProductPhotosUrls(id);

  return (
    <Paper shadow="sm" withBorder radius="lg">
      <ProductNavigationAnchor label="" />
      <Carousel
        height="100%"
        h="100%"
        controlSize={36}
        align="start"
        slideGap={0}
        withIndicators
        nextControlIcon={<IconChevronRight size={24} />}
        previousControlIcon={<IconChevronLeft size={24} />}
        styles={{
          indicator: {
            width: 12,
            height: 8,
            backgroundColor: 'var(--mantine-color-blue-7)',
            transition: 'width 200ms ease',
            '&[data-active]': {
              width: 24,
            },
          },
          control: {
            color: 'var(--mantine-color-blue-7)',
            '&[data-inactive]': {
              opacity: 0,
              cursor: 'default',
              pointerEvents: 'none',
            },
          },
        }}
      >
        {photosUrls.map((url) => (
          <CarouselSlide key={url} h="100%">
            <Image
              src={url}
              fit="contain"
              h="100%"
              height="100%"
              styles={{
                figure: {
                  height: '100%',
                },
                imageWrapper: {
                  height: '100%',
                },
              }}
            />
          </CarouselSlide>
        ))}
      </Carousel>
    </Paper>
  );
}
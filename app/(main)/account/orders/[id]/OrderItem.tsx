import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Center, Flex, Text } from '@lib/components/wrappers';
import { API_URL, OrderItem as OrderItemModel } from '@lib/api';
import Price from '@lib/components/ui/Price';

export default function OrderItem({ item }: { item: OrderItemModel }) {
  const { product } = item;
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;

  return (
    <Flex
      direction="row"
      gap="md"
      p={2}
      px={16}
      align="center"
      sx={{
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          textDecoration: 'underline',
        },
        '&:not(:last-child)': {
          marginBottom: 'var(--mantine-spacing-md)',
        },
      }}
    >
      <Box
        component={Link}
        href={`/products/${item.product.id}`}
        target="_blank"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 100,
          zIndex: 10,
        }}
      />
      {photoId ? (
        <Image
          src={photoUrl}
          width={60}
          height={60}
          alt=""
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        />
      ) : (
        <Center
          w={60}
          h={60}
          sx={{
            backgroundColor: 'var(--mantine-color-gray-2)',
            color: 'var(--mantine-color-gray-6)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <IconPackage size={30} strokeWidth={1} />
        </Center>
      )}
      <div>
        <Text fz={18} fw={600} lineClamp={1}>
          {item.quantity} x {product.name}
        </Text>
      </div>
      <Box sx={{ flex: 1 }} />
      <Flex direction="column" align="flex-end" gap="sm" sx={{ zIndex: 20 }}>
        <Text fz={20} fw={600} lineClamp={1} sx={{ whiteSpace: 'nowrap' }}>
          {/* @ts-expect-error Server Component */}
          <Price price={item.quantity * item.price} />
        </Text>
      </Flex>
    </Flex>
  );
}

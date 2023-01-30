import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, CartItem as CartItemModel } from '@lib/api';
import { Box, Center, Flex, Text } from '@lib/components/wrappers';
import Price from '@lib/components/ui/Price';
import CartItemActions from './CartItemActions';

export default function CartItem({ item }: { item: CartItemModel }) {
  const { product } = item;
  const photoId = product.photosOrder
    ? parseInt(product.photosOrder.split(',')[0], 10)
    : product.photos[0]?.id;
  const photoUrl = `${API_URL}/products/${product.id}/photos/${photoId}?thumbnail=true`;

  return (
    <Flex
      direction="row"
      gap="md"
      p={10}
      px={16}
      align="center"
      sx={{
        borderRadius: 'var(--mantine-radius-md)',
        border: '1px solid transparent',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          border: '1px solid var(--mantine-color-gray-4)',
          '> div:nth-child(3)': {
            textDecoration: 'underline',
          },
        },
        '&:not(:last-child)': {
          marginBottom: 'var(--mantine-spacing-md)',
        },
        '&:not(:last-child)::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          bottom: -10,
          height: 1,
          left: 0,
          right: 0,
          backgroundColor: 'var(--mantine-color-gray-4)',
        },
      }}
    >
      <Box
        component={Link}
        href={`/products/${item.product.id}`}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 200,
          zIndex: 10,
        }}
      />
      {photoId ? (
        <Image
          src={photoUrl}
          width={90}
          height={90}
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
          w={90}
          h={90}
          sx={{
            backgroundColor: 'var(--mantine-color-gray-2)',
            color: 'var(--mantine-color-gray-6)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <IconPackage size={40} strokeWidth={1} />
        </Center>
      )}
      <div>
        <Text fz={20} fw={600} lineClamp={1} mb={2}>
          {product.name}
        </Text>
        <Text fz={18} fw={500} c="gray.7">
          {/* @ts-expect-error Server Component */}
          <Price price={product.price} />
        </Text>
        {/*<Text fz={18} fw={600}>*/}
        {/*  /!* @ts-expect-error Server Component *!/*/}
        {/*  <Price price={item.quantity * product.price} />*/}
        {/*</Text>*/}
      </div>
      <Box sx={{ flex: 1 }} />
      <Flex direction="column" align="flex-end" gap="sm" sx={{ zIndex: 20 }}>
        <CartItemActions item={item} />
        <Text fz={22} fw={600}>
          {/* @ts-expect-error Server Component */}
          <Price price={item.quantity * product.price} />
        </Text>
      </Flex>
    </Flex>
  );
}

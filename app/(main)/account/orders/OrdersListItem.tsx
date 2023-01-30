import Image from 'next/image';
import { IconPackage } from '@tabler/icons';
import Link from 'next/link';
import { API_URL, Order } from '@lib/api';
import { Box, Flex, Paper, Text, Center } from '@lib/components/wrappers';
import Price from '@lib/components/ui/Price';
import OrderBadge from './OrderBadge';

export default function OrdersListItem({
  order,
}: {
  order: Order & { total: number; countItems: number };
}) {
  const items = order.items.map((item) => {
    const photoId = item.product.photosOrder
      ? parseInt(item.product.photosOrder.split(',')[0], 10)
      : item.product.photos[0]?.id;
    const photoUrl = `${API_URL}/products/${item.product.id}/photos/${photoId}?thumbnail=true`;
    return photoId ? (
      <Image
        key={item.product.id}
        src={photoUrl}
        width={40}
        height={40}
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
        key={item.product.id}
        w={40}
        h={40}
        sx={{
          backgroundColor: 'var(--mantine-color-gray-2)',
          color: 'var(--mantine-color-gray-6)',
          borderRadius: 'var(--mantine-radius-md)',
        }}
      >
        <IconPackage size={30} strokeWidth={1} />
      </Center>
    );
  });

  return (
    <Paper
      withBorder
      p="md"
      pt="xs"
      component={Link}
      href={`/account/orders/${order.id}`}
      sx={{
        transition: 'box-shadow 0.2s var(--mantine-transition-timing-function)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 'var(--mantine-shadow-md)',
        },
      }}
    >
      <Flex align="center" gap="md">
        <Text fw={600} fz={20}>
          Order #{order.id}
        </Text>
        <OrderBadge status={order.status} />
        <Box sx={{ flex: 1 }} />
        <Text fw={500} fz={16} c="gray.6">
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(order.created))}
        </Text>
      </Flex>
      <Flex direction="row" gap="md" align="flex-end" mt="xs">
        {items}
        {order.items.length < order.countItems && (
          <Center w={60} h={40}>
            <Text fw={500} fz={16} color="gray.7">
              +{order.countItems - order.items.length} more
            </Text>
          </Center>
        )}
        <Box sx={{ flex: 1 }} />
        <Text fz={20} fw={700}>
          {/* @ts-expect-error Server Component */}
          <Price price={order.total} />
        </Text>
      </Flex>
    </Paper>
  );
}

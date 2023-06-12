import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons';
import { headers } from 'next/headers';
import {
  Box,
  Button,
  Divider,
  Flex,
  Title,
  Text,
} from '@lib/components/wrappers';
import { ordersApi } from '@lib/api';
import Price from '@lib/components/ui/Price';
import OrderBadge from '../OrderBadge';
import OrderItem from './OrderItem';
import ReturnFormModal from './ReturnFormModal';
import ReturnBadge from '../../returns/ReturnBadge';

async function getOrder(id: number) {
  const cookie = headers().get('cookie') ?? '';
  return ordersApi.getOrder(
    { id },
    {
      cache: 'no-store',
      headers: { cookie },
      next: {
        tags: ['orders'],
      },
    },
  );
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!id || Number.isNaN(parseInt(id, 10))) return {};

  return { title: `Order #${id}` };
}
export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const order = await getOrder(parseInt(id, 10));

  const itemsTotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const total =
    itemsTotal + order.delivery.method.price + order.payment.method.price;
  return (
    <>
      <Button
        variant="outline"
        component={Link}
        href="/account/orders"
        radius="xl"
        mb="xl"
        leftIcon={<IconArrowLeft />}
      >
        View all orders
      </Button>
      <Flex justify="space-between" mb="sm">
        <Title order={2}>Order #{id}</Title>
        <OrderBadge status={order.status} />
      </Flex>
      <Divider />
      {order.return && (
        <>
          <Flex align="center" mt="lg" mb="sm" gap="md">
            <Title order={3}>Return</Title>
            <ReturnBadge status={order.return.status} />
            <Box sx={{ flex: 1 }} />{' '}
            <Text fw={500} fz={16} c="gray.6">
              Created:
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(order.return.created))}
            </Text>
          </Flex>

          <Text fw={400} mb="lg">
            Message: <br />
            {order.return.message}
          </Text>
          <Divider />
        </>
      )}

      <Flex direction="row" mt="lg" gap="xl" wrap="wrap" mb="lg">
        <Box>
          <Text fw={700} fz={18}>
            Details
          </Text>
          <Text fw={400}>
            ID: {order.id}
            <br />
            Created:{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(order.created))}
            <br />
            {!order.return && <ReturnFormModal order={order} />}
          </Text>
        </Box>
        <Box>
          <Text fw={700} fz={18}>
            Contact info
          </Text>
          <Text fw={400}>
            Full name: {order.fullName}
            <br />
            Email address: {order.contactEmail}
            <br />
            Phone number:{order.contactPhone}
          </Text>
        </Box>
        <Box>
          <Text fw={700} fz={18}>
            Delivery
          </Text>
          <Text fw={400}>
            Method: {order.delivery.method.name} (
            {/* @ts-expect-error Server Component */}
            <Price price={order.delivery.method.price || 0} />)
            <br />
            Address: {order.delivery.address}
            <br />
            City: {order.delivery.city}
            {order.delivery.postalCode && (
              <>
                <br />
                Postal code: {order.delivery.postalCode}
              </>
            )}
            <br />
            Country: {order.delivery.country}
          </Text>
        </Box>
        <Box>
          <Text fw={700} fz={18}>
            Payment
          </Text>
          <Text fw={400}>
            Method: {order.payment.method.name} (
            {/* @ts-expect-error Server Component */}
            <Price price={order.payment.method.price || 0} />)
          </Text>
        </Box>
      </Flex>
      <Divider />
      <Box pt={2} mt="lg">
        <div>
          {order.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
        <Divider mt="xl" mb="xs" />
        <Flex justify="space-between" px="sm" align="flex-end">
          <Text size={16} c="gray.7">
            Items total
          </Text>
          <Text size={20} weight={600} ml="auto">
            {/* @ts-expect-error Server Component */}
            <Price price={itemsTotal} />
          </Text>
        </Flex>
        <Flex justify="space-between" px="sm" align="flex-end">
          <Text size={16} c="gray.7">
            Shipping
          </Text>
          <Text size={20} weight={600} ml="auto">
            {/* @ts-expect-error Server Component */}
            <Price price={order.delivery.method.price} />
          </Text>
        </Flex>
        <Flex justify="space-between" px="sm" align="flex-end">
          <Text size={16} c="gray.7">
            Payment
          </Text>
          <Text size={20} weight={600} ml="auto">
            {/* @ts-expect-error Server Component */}
            <Price price={order.payment.method.price} />
          </Text>
        </Flex>
        <Flex justify="space-between" px="sm" align="flex-end" mt="xs">
          <Text size={20} c="gray.7">
            Total
          </Text>
          <Text size={28} weight={600} ml="auto">
            {/* @ts-expect-error Server Component */}
            <Price price={total} />
          </Text>
        </Flex>
      </Box>
    </>
  );
}

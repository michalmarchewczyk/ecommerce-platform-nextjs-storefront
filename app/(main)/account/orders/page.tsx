import { headers } from 'next/headers';
import { Center, Flex, Text, Title } from '@lib/components/wrappers';
import { ordersApi } from '@lib/api';
import OrdersListItem from './OrdersListItem';

async function getUserOrders() {
  const cookie = headers().get('cookie') ?? '';
  const orders = await ordersApi.getUserOrders({
    cache: 'no-store',
    headers: { cookie },
    next: {
      tags: ['orders'],
    },
  });
  return orders
    .sort((a, b) => b.id - a.id)
    .map((order) => ({
      ...order,
      items: order.items.slice(0, 5),
      countItems: order.items.length,
      total: order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
    }));
}

export const metadata = {
  title: 'Orders',
};

export default async function Page() {
  const orders = await getUserOrders();
  return (
    <>
      <Title order={2} mb="md">
        My orders
      </Title>
      <Flex direction="column" gap="md">
        {orders.length === 0 && (
          <Center mih={200}>
            <Text fz={40} fw={400} c="gray.6">
              No orders found
            </Text>
          </Center>
        )}
        {orders.map((order) => (
          <div key={order.id}>
            <OrdersListItem order={order} />
          </div>
        ))}
      </Flex>
    </>
  );
}

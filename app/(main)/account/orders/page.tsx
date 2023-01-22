import { headers } from 'next/headers';
import { Flex, Title } from '../../../../lib/components/wrappers';
import { ordersApi } from '../../../../lib/api';
import OrdersListItem from './OrdersListItem';

async function getUserOrders() {
  const cookie = headers().get('cookie') ?? '';
  const orders = await ordersApi.getUserOrders({
    cache: 'no-store',
    headers: { cookie },
  });
  return orders
    .sort((a, b) => b.id - a.id)
    .map((order) => ({
      ...order,
      items: order.items.slice(0, 5),
      total: order.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
    }));
}

export default async function Page() {
  const orders = await getUserOrders();
  return (
    <>
      <Title order={2} mb="md">
        My orders
      </Title>
      <Flex direction="column" gap="md">
        {orders.map((order) => (
          <div key={order.id}>
            <OrdersListItem order={order} />
          </div>
        ))}
      </Flex>
    </>
  );
}

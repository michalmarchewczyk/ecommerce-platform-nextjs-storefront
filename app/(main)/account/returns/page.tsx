import { headers } from 'next/headers';
import { Flex, Title, Text, Center } from '@lib/components/wrappers';
import { Order, ordersApi, Return } from '@lib/api';
import ReturnsListItem from './ReturnsListItem';

async function getUserReturns() {
  const cookie = headers().get('cookie') ?? '';
  const orders = await ordersApi.getUserOrders({
    cache: 'no-store',
    headers: { cookie },
  });
  return orders
    .filter((o): o is Order & { return: Return } => o.return !== null)
    .sort((a, b) => b.id - a.id)
    .map((order) => ({
      ...order.return,
      order,
    }));
}

export const metadata = {
  title: 'Returns',
};

export default async function Page() {
  const returns = await getUserReturns();
  return (
    <>
      <Title order={2} mb="md">
        My returns
      </Title>
      <Flex direction="column" gap="md">
        {returns.length === 0 && (
          <Center mih={200}>
            <Text fz={40} fw={400} c="gray.6">
              No returns found
            </Text>
          </Center>
        )}
        {returns.map((item) => (
          <div key={item.id}>
            <ReturnsListItem item={item} />
          </div>
        ))}
      </Flex>
    </>
  );
}

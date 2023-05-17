import { headers } from 'next/headers';
import {
  Center,
  Container,
  Divider,
  Flex,
  Paper,
  Title,
  Text,
  Box,
} from '@lib/components/wrappers';
import BigLogo from '@lib/components/ui/BigLogo';
import Background from '@lib/components/ui/Background';
import { cartsApi } from '@lib/api';
import Price from '@lib/components/ui/Price';

export const metadata = {
  title: 'Checkout',
};

async function getCart() {
  const cookie = headers().get('cookie') ?? '';
  const cart = await cartsApi.getCart({
    cache: 'no-store',
    headers: { cookie },
  });
  return {
    count: cart.items.length,
    total: cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ),
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { count, total } = await getCart();

  return (
    <>
      <BigLogo />

      <Center style={{ height: '100vh' }}>
        <Container size="lg" px="md" mih="calc(100vh - 500px)" w="100%">
          <Paper shadow="lg" p="xl" w="100%" pt="lg">
            <Flex justify="space-between">
              <Title order={2} mb="xl">
                Checkout
              </Title>
              <Box mt={-8}>
                <Text fz={18} fw={500} c="gray.7" align="right" mb={-4}>
                  {count} item{count > 1 ? 's' : ''}
                </Text>
                <Text fz={22} fw={600} align="right">
                  {/* @ts-expect-error Server Component */}
                  <Price price={total} />
                </Text>
              </Box>
            </Flex>

            <Divider mx="-xl" mb="xl" />
            {children}
          </Paper>
        </Container>
      </Center>

      <Background />
    </>
  );
}

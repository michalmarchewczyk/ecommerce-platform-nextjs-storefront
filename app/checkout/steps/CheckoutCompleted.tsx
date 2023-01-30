'use client';

import { Button, Flex, Text } from '@mantine/core';
import Link from 'next/link';

export default function CheckoutCompleted({
  orderId,
}: {
  orderId: number | null;
}) {
  return (
    <Flex direction="column" align="center">
      <Text size="xl" align="center" mt="xl">
        Thank you for your order!
      </Text>
      <Button
        variant="filled"
        component={Link}
        href={`/account/orders/${orderId}`}
        mt="lg"
        mb="xl"
        size="md"
        radius="xl"
      >
        View details
      </Button>
    </Flex>
  );
}

'use client';

import { Box, Button, Divider, Flex } from '@mantine/core';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import { useCheckoutFormContext } from '../checkoutForm';

export default function CheckoutPayment({
  back,
  next,
}: {
  back: () => void;
  next: () => void;
}) {
  const form = useCheckoutFormContext();

  return (
    <Flex direction="column">
      <Divider mx="-xl" mt="xs" mb="md" />
      <Box>
        <CheckoutPaymentMethods />
      </Box>
      <Divider mx="-xl" mt="xl" />
      <Flex direction="row" justify="space-between" mt="md" mb={-6}>
        <Button variant="subtle" onClick={back}>
          Back
        </Button>
        <Button
          variant="filled"
          onClick={next}
          disabled={
            !form.isDirty('payment.methodId') ||
            Object.keys(form.errors).length !== 0
          }
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
}

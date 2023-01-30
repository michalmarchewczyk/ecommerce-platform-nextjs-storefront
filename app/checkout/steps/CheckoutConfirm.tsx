'use client';

import { Box, Button, Divider, Flex, Text } from '@mantine/core';
import useSWR from 'swr';
import Link from 'next/link';
import { cartsApi, deliveryMethodsApi, paymentMethodsApi } from '@lib/api';
import PriceClient from '@lib/components/ui/PriceClient';
import { useCheckoutFormContext } from '../checkoutForm';
import CheckoutItem from './CheckoutItem';

export default function CheckoutConfirm({ back }: { back: () => void }) {
  const form = useCheckoutFormContext();

  const {
    data: cart,
    error,
    isLoading,
  } = useSWR('cart', () => cartsApi.getCart());

  const { data: deliveryMethods } = useSWR('deliveryMethods', () =>
    deliveryMethodsApi.getDeliveryMethods(),
  );

  const { data: paymentMethods } = useSWR('paymentMethods', () =>
    paymentMethodsApi.getPaymentMethods(),
  );

  if (isLoading || error || !cart) {
    return null;
  }

  const itemsTotal = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const deliveryMethod = deliveryMethods?.find(
    (method) => method.id === form.values.delivery.methodId,
  );

  const paymentMethod = paymentMethods?.find(
    (method) => method.id === form.values.payment.methodId,
  );

  const total =
    itemsTotal + (deliveryMethod?.price || 0) + (paymentMethod?.price || 0);

  return (
    <Flex direction="column">
      <Divider mx="-xl" mt="xs" mb="md" />
      <Flex>
        <Box sx={{ flex: 1 }} pt={2} ml="-sm">
          <div>
            {cart.items.slice(0, 6).map((item) => (
              <CheckoutItem key={item.id} item={item} />
            ))}
            {cart.items.length > 6 && (
              <Button
                variant="subtle"
                component={Link}
                target="_blank"
                href="/cart"
                w="100%"
                color="gray.7"
                size="md"
              >
                + {cart.items.length - 6} more items
              </Button>
            )}
          </div>
          <Divider mt="xs" mb="xs" />
          <Flex justify="space-between" px="sm" align="flex-end">
            <Text size={16} c="gray.7">
              Items total
            </Text>
            <Text size={20} weight={600} ml="auto">
              <PriceClient price={itemsTotal} />
            </Text>
          </Flex>
          <Flex justify="space-between" px="sm" align="flex-end">
            <Text size={16} c="gray.7">
              Shipping
            </Text>
            <Text size={20} weight={600} ml="auto">
              <PriceClient price={deliveryMethod?.price || 0} />
            </Text>
          </Flex>
          <Flex justify="space-between" px="sm" align="flex-end">
            <Text size={16} c="gray.7">
              Payment
            </Text>
            <Text size={20} weight={600} ml="auto">
              <PriceClient price={paymentMethod?.price || 0} />
            </Text>
          </Flex>
          <Flex justify="space-between" px="sm" align="flex-end" mt="xs">
            <Text size={20} c="gray.7">
              Total
            </Text>
            <Text size={28} weight={600} ml="auto">
              <PriceClient price={total} />
            </Text>
          </Flex>
        </Box>
        <Divider orientation="vertical" ml="md" mr="xl" />
        <Box sx={{ flex: 1 }}>
          <Text fw={700} fz={18}>
            Contact info
          </Text>
          <Text fw={400}>
            {form.values.fullName}
            <br />
            {form.values.contactEmail}
            <br />+{form.values.contactPhone}
          </Text>
          <Text fw={700} fz={18} mt="sm">
            Delivery
          </Text>
          <Text fw={400}>
            {deliveryMethod?.name} (
            <PriceClient price={deliveryMethod?.price || 0} />)
            <br />
            {form.values.delivery.address}
            <br />
            {form.values.delivery.city}
            {form.values.delivery.postalCode && (
              <>
                <br />
                {form.values.delivery.postalCode}
              </>
            )}
            <br />
            {form.values.delivery.country}
          </Text>
          <Text fw={700} fz={18} mt="sm">
            Payment
          </Text>
          <Text fw={400}>
            {paymentMethod?.name} (
            <PriceClient price={paymentMethod?.price || 0} />)
          </Text>
        </Box>
      </Flex>
      <Divider mx="-xl" mt="xl" />
      <Flex direction="row" justify="space-between" mt="md" mb={-6}>
        <Button variant="subtle" onClick={back}>
          Back
        </Button>
        <Button variant="filled" type="submit">
          Order
        </Button>
      </Flex>
    </Flex>
  );
}

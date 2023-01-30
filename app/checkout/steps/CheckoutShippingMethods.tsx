'use client';

import useSWR from 'swr';
import { Box, Paper, Radio, Text } from '@mantine/core';
import { deliveryMethodsApi } from '@lib/api';
import PriceClient from '@lib/components/ui/PriceClient';
import { useCheckoutFormContext } from '../checkoutForm';

export default function CheckoutShippingMethods() {
  const form = useCheckoutFormContext();

  const {
    data: methods,
    error,
    isLoading,
  } = useSWR('deliveryMethods', () => deliveryMethodsApi.getDeliveryMethods());

  if (isLoading || error || !methods) {
    return null;
  }

  return (
    <Box>
      <Radio.Group
        value={form.values.delivery.methodId.toString()}
        label="Delivery Method"
        withAsterisk
        onChange={(v) =>
          form.setFieldValue('delivery.methodId', parseInt(v, 10))
        }
      >
        {methods.map((method) => (
          <Radio
            key={method.id}
            value={method.id.toString()}
            mt={4}
            ml={10}
            sx={{
              div: {
                cursor: 'pointer',
              },
              '&:hover': {
                div: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                },
              },
              '&[data-checked=true]': {
                div: {
                  borderColor: 'var(--mantine-color-indigo-6)',
                },
              },
            }}
            label={
              <Paper withBorder ml={-42} pl={42} mt={-10} pr={12} pt={4} pb={6}>
                <Text fz={16}>{method.name}</Text>
                <Text fz={14} c="gray.7" fw={500}>
                  {method.description}
                </Text>
                <Text fz={16}>
                  <PriceClient price={method.price} />
                </Text>
              </Paper>
            }
          />
        ))}
      </Radio.Group>
    </Box>
  );
}

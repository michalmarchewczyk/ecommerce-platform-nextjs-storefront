'use client';

import { Button, Divider, Flex, TextInput } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useCheckoutFormContext } from '../checkoutForm';
import CheckoutShippingMethods from './CheckoutShippingMethods';

const CountrySelect = dynamic(
  () => import('@lib/components/form/CountrySelect'),
);
const PhoneInput = dynamic(() => import('@lib/components/form/PhoneInput'));

export default function CheckoutShipping({
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
      <CheckoutShippingMethods />
      <Flex direction="row" gap="md" mt="lg">
        <Flex direction="column" gap="xs" sx={{ flex: 1 }}>
          <TextInput
            label="Full name"
            withAsterisk
            {...form.getInputProps('fullName')}
          />
          <TextInput
            label="Contact email"
            withAsterisk
            {...form.getInputProps('contactEmail')}
          />
          <PhoneInput
            label="Contact phone"
            withAsterisk
            {...form.getInputProps('contactPhone')}
          />
        </Flex>
        <Flex direction="column" gap="xs" sx={{ flex: 1 }}>
          <TextInput
            label="Address"
            withAsterisk
            {...form.getInputProps('delivery.address')}
          />
          <TextInput
            label="City"
            withAsterisk
            {...form.getInputProps('delivery.city')}
          />
          <TextInput
            label="Postal code"
            {...form.getInputProps('delivery.postalCode')}
          />
          <CountrySelect
            label="Country"
            searchable
            nothingFound="No countries found"
            withAsterisk
            type="normal"
            {...form.getInputProps('delivery.country')}
          />
        </Flex>
      </Flex>

      <Divider mx="-xl" mt="xl" />
      <Flex direction="row" justify="space-between" mt="md" mb={-6}>
        <Button variant="subtle" onClick={back}>
          Back
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            let { hasError } = form.validateField('contactPhone');
            hasError ||= form.validateField('contactEmail').hasError;
            hasError ||= form.validateField('fullName').hasError;
            hasError ||= form.validateField('delivery.address').hasError;
            hasError ||= form.validateField('delivery.city').hasError;
            hasError ||= form.validateField('delivery.country').hasError;
            hasError ||= form.validateField('delivery.methodId').hasError;
            if (!hasError) {
              next();
            }
          }}
          disabled={
            !form.isDirty('fullName') ||
            !form.isDirty('contactPhone') ||
            !form.isDirty('contactEmail') ||
            !form.isDirty('delivery.methodId') ||
            !form.isDirty('delivery.address') ||
            !form.isDirty('delivery.city') ||
            !form.isDirty('delivery.country') ||
            Object.keys(form.errors).length !== 0
          }
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
}

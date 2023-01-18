'use client';

import { Button, Divider, Flex, Select, TextInput } from '@mantine/core';
import { countries, getEmojiFlag } from 'countries-list';
import useSWR from 'swr';
import { useCheckoutFormContext } from './checkoutForm';
import CheckoutShippingMethods from './CheckoutShippingMethods';
import { settingsApi } from '../../lib/api';

const countriesData = Object.entries(countries).map(([code, country]) => ({
  value: code,
  label: `${getEmojiFlag(code)} ${country.name} (${code})`,
}));

export default function CheckoutShipping({
  back,
  next,
}: {
  back: () => void;
  next: () => void;
}) {
  const form = useCheckoutFormContext();

  const { data: countriesFilter } = useSWR('countriesFilter', () =>
    settingsApi.getSettingValueByName({ name: 'Countries' }),
  );

  const filteredCountriesData =
    countriesFilter
      ?.split(',')
      .map((code) => countriesData.find((c) => c.value === code))
      .filter((v): v is { value: string; label: string } => !!v) ?? [];

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
          <TextInput
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
          <Select
            label="Country"
            searchable
            nothingFound="No countries found"
            withAsterisk
            {...form.getInputProps('delivery.country')}
            data={filteredCountriesData}
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
          onClick={next}
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

'use client';

import { Flex, NumberInput } from '@mantine/core';
import {
  CountryCode,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  isSupportedCountry,
  parseIncompletePhoneNumber,
  parsePhoneNumber,
} from 'libphonenumber-js';
import { useEffect, useState } from 'react';
import CountrySelect from './CountrySelect';

export default function PhoneInput(
  props: React.ComponentProps<typeof NumberInput>,
) {
  const [country, setCountry] = useState<string | null>(null);
  const [phone, setPhone] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!props.value) return;
    try {
      const parsed = parsePhoneNumber(`+${props.value}`);
      if (parsed) {
        setCountry(parsed.country ?? null);
        setPhone(parseInt(parsed.nationalNumber, 10));
      }
    } catch (e) {
      // ignore
    }
  }, [props.value]);

  const update = (c: string | null, p: number | undefined) => {
    if (!c || !p || !isSupportedCountry(c)) {
      props.onChange?.(-1);
    } else {
      props.onChange?.(
        parseInt(`${getCountryCallingCode(c as CountryCode)}${p}`, 10),
      );
    }
  };

  return (
    <Flex gap={4}>
      <CountrySelect
        sx={{ width: 100, zIndex: 1 }}
        label={' '}
        type="phone"
        value={country}
        error={props.error ? ' ' : undefined}
        onChange={(v) => {
          setCountry(v);
          update(v, phone);
        }}
      />
      <NumberInput
        {...props}
        disabled={country === null}
        sx={{ flex: 1 }}
        hideControls
        value={phone}
        onChange={(v) => {
          setPhone(v);
          update(country, v);
        }}
        styles={{
          root: {
            marginLeft: -104,
            paddingRight: 104,
          },
          input: {
            marginLeft: 104,
          },
        }}
        parser={(value) => {
          if (!value || !country) return '';
          return parseIncompletePhoneNumber(value);
        }}
        formatter={(value) => {
          if (!value || !country) return '';
          return formatIncompletePhoneNumber(value, country as CountryCode);
        }}
      />
    </Flex>
  );
}

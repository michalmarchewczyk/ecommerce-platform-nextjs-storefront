'use client';

import { Select } from '@mantine/core';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Noto_Color_Emoji } from 'next/font/google';
import { countries, Country, getEmojiFlag } from 'countries-list';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { settingsApi } from '@lib/api';

const notoColorEmoji = Noto_Color_Emoji({
  weight: ['400'],
  variable: '--font-noto-color-emoji',
  display: 'swap',
  subsets: ['emoji'],
  adjustFontFallback: false,
});

export default function CountrySelect(
  props: Omit<React.ComponentProps<typeof Select>, 'data'> & {
    type: 'normal' | 'phone';
  },
) {
  const [filteredCountriesData, setFilteredCountriesData] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: countriesFilter, isLoading } = useSWR('countriesFilter', () =>
    settingsApi.getSettingValueByName({ name: 'Countries' }),
  );

  const formatCountry = (code: string, country: Country) => {
    if (props.type === 'phone') {
      try {
        const callingCode = getCountryCallingCode(code as CountryCode);
        return `${getEmojiFlag(code)}  +${callingCode}`;
      } catch (e) {
        return `${getEmojiFlag(code)}  ${country.name} (${code})`;
      }
    } else {
      return `${getEmojiFlag(code)}  ${country.name} (${code})`;
    }
  };

  const getData = () => {
    if (filteredCountriesData.length > 0) {
      return;
    }
    const countriesData = Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: formatCountry(code, country),
    }));
    setFilteredCountriesData(
      countriesFilter
        ?.split(',')
        .map((code) => countriesData.find((c) => c.value === code))
        .filter((v): v is { value: string; label: string } => !!v) ?? [],
    );
  };

  useEffect(() => {
    if (props.value && !isLoading) {
      getData();
    }
  }, [props.value, isLoading]);

  return (
    <Select
      {...props}
      data={filteredCountriesData}
      onFocus={getData}
      className={notoColorEmoji.variable}
      styles={{
        item: {
          fontFamily: 'Roboto, var(--font-noto-color-emoji), sans-serif',
          '@-moz-document url-prefix()': {
            fontFamily: 'Roboto, sans-serif',
          },
        },
        input: {
          fontFamily: 'Roboto, var(--font-noto-color-emoji), sans-serif',
          '@-moz-document url-prefix()': {
            fontFamily: 'Roboto, sans-serif',
          },
        },
      }}
    />
  );
}

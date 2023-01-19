'use client';

import { Select } from '@mantine/core';
import useSWR from 'swr';
import { useState } from 'react';
import { Noto_Color_Emoji } from '@next/font/google';
import { countries, getEmojiFlag } from 'countries-list';
import { settingsApi } from '../../lib/api';

const notoColorEmoji = Noto_Color_Emoji({
  weight: ['400'],
  variable: '--font-noto-color-emoji',
  display: 'swap',
  subsets: ['emoji'],
  adjustFontFallback: false,
});

export default function CountrySelect(
  props: Omit<React.ComponentProps<typeof Select>, 'data'>,
) {
  const [filteredCountriesData, setFilteredCountriesData] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: countriesFilter } = useSWR('countriesFilter', () =>
    settingsApi.getSettingValueByName({ name: 'Countries' }),
  );

  const getData = async () => {
    const countriesData = Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: `${getEmojiFlag(code)}  ${country.name} (${code})`,
    }));
    setFilteredCountriesData(
      countriesFilter
        ?.split(',')
        .map((code) => countriesData.find((c) => c.value === code))
        .filter((v): v is { value: string; label: string } => !!v) ?? [],
    );
  };

  return (
    <Select
      {...props}
      data={filteredCountriesData}
      onFocus={getData}
      className={notoColorEmoji.variable}
      styles={{
        item: {
          fontFamily: 'Roboto, var(--font-noto-color-emoji), sans-serif',
        },
        input: {
          fontFamily: 'Roboto, var(--font-noto-color-emoji), sans-serif',
        },
      }}
    />
  );
}

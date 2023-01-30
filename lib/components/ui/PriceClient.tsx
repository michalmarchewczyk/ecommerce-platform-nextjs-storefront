'use client';

import useSWR from 'swr';
import { settingsApi } from '@lib/api';

export default function PriceClient({ price }: { price: number }) {
  const {
    data: currency,
    error,
    isLoading,
  } = useSWR('currency', () =>
    settingsApi.getSettingValueByName({ name: 'Currency' }),
  );
  if (isLoading || error || !currency) {
    return null;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return (
    <>
      {formatter
        .format(price)
        .replace(/^(\D+)/, '$1 ')
        .replace(/\s+/, ' ')}
    </>
  );
}

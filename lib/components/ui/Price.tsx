import { settingsApi } from '@lib/api';

async function getCurrency() {
  return settingsApi.getSettingValueByName({ name: 'Currency' });
}

export default async function Price({ price }: { price: number }) {
  const currency = await getCurrency();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter
    .format(price)
    .replace(/^(\D+)/, '$1 ')
    .replace(/\s+/, ' ');
}

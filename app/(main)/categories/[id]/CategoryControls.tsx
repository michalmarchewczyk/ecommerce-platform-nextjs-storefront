'use client';

import { Flex, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  IconChevronDown,
  IconSortAscending2,
  IconSortAscendingLetters,
  IconSortAscendingNumbers,
  IconSortDescending2,
  IconSortDescendingLetters,
  IconSortDescendingNumbers,
} from '@tabler/icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PrefetchKind } from 'next/dist/client/components/router-reducer/router-reducer-types';
import styles from './CategoryControls.module.scss';

const PAGE_SIZE = 12;

const sortMethods = [
  {
    value: 'price-asc',
    label: 'Price: low to high',
    icon: IconSortAscendingNumbers,
  },
  {
    value: 'price-desc',
    label: 'Price: high to low',
    icon: IconSortDescendingNumbers,
  },
  { value: 'name-asc', label: 'Name: A to Z', icon: IconSortAscendingLetters },
  {
    value: 'name-desc',
    label: 'Name: Z to A',
    icon: IconSortDescendingLetters,
  },
  { value: 'date-desc', label: 'Date: new to old', icon: IconSortDescending2 },
  { value: 'date-asc', label: 'Date: old to new', icon: IconSortAscending2 },
];

export default function CategoryControls({
  countProducts,
}: {
  countProducts: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = params.has('page')
    ? parseInt(params.get('page') as string, 10)
    : 1;
  const sort = params.has('sort') ? params.get('sort') : 'price-asc';
  const [selected, setSelected] = useState(
    sortMethods.find((m) => m.value === sort) ?? sortMethods[0],
  );

  const links: Record<string, string> = Object.fromEntries(
    sortMethods.map((m) => {
      const newParams = new URLSearchParams(params);
      newParams.set('sort', m.value);
      return [m.value, `${pathname}?${newParams.toString()}`];
    }),
  );

  useEffect(() => {
    Object.values(links).forEach((link) => {
      router.prefetch(link, {
        kind: PrefetchKind.FULL,
      });
    });
  }, [links]);

  const updateSort = (method: (typeof sortMethods)[number]) => {
    router.push(links[method.value]);
    setSelected(method);
  };

  const productsStart = (page - 1) * PAGE_SIZE + 1;
  const productsEnd = Math.min(page * PAGE_SIZE, countProducts);

  return (
    <Flex w="100%" justify="space-between" align="end" wrap="wrap" rowGap={12}>
      <Text fw={400} c="gray.9">
        Showing {productsStart} - {productsEnd} (
        {productsEnd - productsStart + 1}) of&nbsp;{countProducts} products
      </Text>
      <Menu radius="md" width={220} shadow="lg">
        <Menu.Target>
          <UnstyledButton className={styles.sortMenu}>
            <Group>
              <selected.icon size={22} />
              <Text fw={500} fz="sm">
                {selected.label}
              </Text>
            </Group>
            <IconChevronDown size={20} stroke={1.5} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {sortMethods.map((method) => (
            <Menu.Item
              key={method.value}
              onClick={() => updateSort(method)}
              icon={<method.icon size={18} />}
            >
              {method.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
}

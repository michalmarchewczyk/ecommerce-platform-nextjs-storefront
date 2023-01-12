'use client';

import { Flex, MediaQuery, SegmentedControl, Text } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
import { useState } from 'react';

interface PageNavigationItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function PageNavigation({
  items,
}: {
  items: PageNavigationItem[];
}) {
  const [hash, setHash] = useState('');

  useWindowEvent('hashchange', () => {
    setHash(window.location.hash.replace('#', ''));
  });

  const itemsData = items.map((item) => ({
    label: (
      <Flex py={4} px={4}>
        {item.icon}
        <Text ml={12}>{item.label}</Text>
      </Flex>
    ),
    value: item.value,
  }));

  const update = (value: string) => {
    if (value === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document
      .getElementById(`nav-${value}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <MediaQuery query="(max-width: 750px)" styles={{ display: 'none' }}>
        <SegmentedControl
          sx={{ position: 'sticky', top: 90, zIndex: 100 }}
          fullWidth
          orientation="vertical"
          size="md"
          radius="lg"
          color="indigo"
          value={hash}
          styles={{
            root: {
              backgroundColor: 'var(--mantine-color-white)',
              border: '1px solid var(--mantine-color-gray-2)',
            },
            control: {
              border: 'none !important',
            },
            active: {
              boxShadow: 'var(--mantine-shadow-sm)',
            },
          }}
          data={itemsData}
          onChange={update}
        />
      </MediaQuery>
      <MediaQuery query="(min-width: 751px)" styles={{ display: 'none' }}>
        <SegmentedControl
          fullWidth
          orientation="horizontal"
          size="md"
          radius="lg"
          color="indigo"
          value={hash}
          styles={{
            root: {
              backgroundColor: 'var(--mantine-color-white)',
              border: '1px solid var(--mantine-color-gray-2)',
              boxShadow: 'var(--mantine-shadow-md)',
            },
            control: {
              border: 'none !important',
            },
            active: {
              boxShadow: 'var(--mantine-shadow-sm)',
            },
          }}
          data={itemsData}
          onChange={update}
        />
      </MediaQuery>
    </>
  );
}

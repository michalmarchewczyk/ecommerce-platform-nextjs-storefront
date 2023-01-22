'use client';

import { Flex, MediaQuery, SegmentedControl, Text } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface PageNavigationItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function PageNavigation({
  items,
  type = 'hash',
}: {
  items: PageNavigationItem[];
  type?: 'hash' | 'url';
}) {
  const [hash, setHash] = useState('');
  const router = useRouter();
  const pathname = usePathname() ?? '';

  useWindowEvent('hashchange', () => {
    if (type === 'hash') {
      setHash(window.location.hash.replace('#', ''));
    }
  });

  const itemsData = items.map((item) => ({
    label: (
      <Flex
        py={4}
        px={4}
        gap={12}
        sx={{ '@media (max-width: 530px)': { justifyContent: 'center' } }}
      >
        {item.icon}
        <Text sx={{ '@media (max-width: 530px)': { display: 'none' } }}>
          {item.label}
        </Text>
      </Flex>
    ),
    value: item.value,
  }));

  const update = (value: string) => {
    if (type === 'hash') {
      if (value === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      document
        .getElementById(`nav-${value}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (type === 'url') {
      router.push(value);
    }
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
          value={type === 'hash' ? hash : pathname}
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
          value={type === 'hash' ? hash : pathname}
          styles={{
            root: {
              backgroundColor: 'var(--mantine-color-white)',
              border: '1px solid var(--mantine-color-gray-2)',
              boxShadow: 'var(--mantine-shadow-md)',
              '@media (max-width: 600px)': {
                marginLeft: '-16px',
                marginRight: '-16px',
                borderRadius: '0',
              },
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

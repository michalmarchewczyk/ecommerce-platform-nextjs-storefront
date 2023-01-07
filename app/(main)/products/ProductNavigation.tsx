'use client';

import { Flex, MediaQuery, SegmentedControl, Text } from '@mantine/core';
import {
  IconAlignJustified,
  IconList,
  IconPhoto,
  IconStar,
} from '@tabler/icons';
import { useWindowEvent } from '@mantine/hooks';
import { useState } from 'react';

export default function ProductNavigation() {
  const [hash, setHash] = useState('');

  useWindowEvent('hashchange', () => {
    setHash(window.location.hash.replace('#', ''));
  });

  const items = [
    {
      label: (
        <Flex py={4} px={4}>
          <IconPhoto size={24} />
          <Text ml={12}>Photos</Text>
        </Flex>
      ),
      value: '',
    },
    {
      label: (
        <Flex py={4} px={4}>
          <IconAlignJustified size={24} />
          <Text ml={12}>Description</Text>
        </Flex>
      ),
      value: 'description',
    },
    {
      label: (
        <Flex py={4} px={4}>
          <IconList size={24} />
          <Text ml={12}>Details</Text>
        </Flex>
      ),
      value: 'details',
    },
    {
      label: (
        <Flex py={4} px={4}>
          <IconStar size={24} />
          <Text ml={12}>Ratings</Text>
        </Flex>
      ),
      value: 'ratings',
    },
  ];

  const update = (value: string) => {
    if (value === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document
      .getElementById(`nav-${value}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <MediaQuery query="(max-width: 750px)" styles={{ display: 'none' }}>
        <SegmentedControl
          sx={{ position: 'sticky', top: 90 }}
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
          data={items}
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
          data={items}
          onChange={update}
        />
      </MediaQuery>
    </>
  );
}

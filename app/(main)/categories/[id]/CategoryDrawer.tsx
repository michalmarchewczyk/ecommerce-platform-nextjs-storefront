'use client';

import { useState } from 'react';
import { ActionIcon, Drawer, ScrollArea, Space } from '@mantine/core';
import { IconFilter } from '@tabler/icons';
import { Text } from '@lib/components/wrappers';

export default function CategoryDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ActionIcon
        variant="filled"
        onClick={() => setOpened(true)}
        size={56}
        radius="xl"
        color="indigo"
        sx={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          boxShadow: 'var(--mantine-shadow-md)',
          zIndex: 100,
        }}
      >
        <IconFilter size={32} stroke={1.6} />
      </ActionIcon>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={10000}
        title={
          <Text weight={600} fz="xl" ml={12}>
            Filters
          </Text>
        }
        padding="md"
        size={286}
        lockScroll={false}
      >
        <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx={-16} px={16}>
          {children}
          <Space h="xl" />
        </ScrollArea>
      </Drawer>
    </>
  );
}

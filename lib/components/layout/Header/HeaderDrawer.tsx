'use client';

import { Burger, Drawer, ScrollArea, Space } from '@mantine/core';
import { ReactNode, useState } from 'react';
import styles from './HeaderDrawer.module.scss';
import { Text } from '../../wrappers';

export default function HeaderDrawer({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Burger opened={opened} onClick={() => setOpened(!opened)} />
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={10000}
        title={
          <Text weight={600} fz="xl" ml={12}>
            Menu
          </Text>
        }
        padding="md"
        size="lg"
        className={styles.hiddenDesktop}
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

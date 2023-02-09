'use client';

import { Button, Container, Paper, Space, Title } from '@mantine/core';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hideNotification, showNotification } from '@mantine/notifications';
import { IconLogout } from '@tabler/icons';
import { authApi } from '@lib/api';
import { mutate } from 'swr';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    authApi
      .logout()
      .then()
      .catch(() => {
        // ignore
      })
      .finally(async () => {
        router.push('/');
        router.refresh();
        await mutate('user', null, { rollbackOnError: false });
        hideNotification('logout');
        showNotification({
          id: 'logout',
          title: 'Signed out',
          message: 'You have been signed out',
          autoClose: 5000,
          icon: <IconLogout size={18} />,
        });
      });
  }, []);

  return (
    <Container size={420} w="100%">
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title align="center" order={3} mb="sm">
          You have been signed out
        </Title>
        <Space h="sm" />
        <Button fullWidth mt="md" component={Link} href="/login">
          Sign in again
        </Button>
      </Paper>
    </Container>
  );
}

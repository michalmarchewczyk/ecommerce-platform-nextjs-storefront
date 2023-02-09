'use client';

import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Space,
} from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconLogin } from '@tabler/icons';
import { authApi } from '@lib/api';
import { mutate } from 'swr';

export default function Page() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (value.length >= 1 ? null : 'Email is required'),
      password: (value) => (value.length >= 1 ? null : 'Password is required'),
    },
    validateInputOnBlur: true,
  });

  const submit = async (values: typeof form.values) => {
    try {
      const res = await authApi.login({ loginDto: values });
      router.push('/');
      router.refresh();
      await mutate('user');
      showNotification({
        title: 'Signed in',
        message: `You have been signed in as ${res.email}`,
        autoClose: 5000,
        icon: <IconLogin size={18} />,
      });
    } catch (e) {
      form.setErrors({
        password: 'Wrong email or password',
      });
    }
  };

  return (
    <Container size={420} w="100%">
      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        component="form"
        onSubmit={form.onSubmit(submit)}
      >
        <Title align="center" order={2} mb="lg">
          Sign in
        </Title>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          withAsterisk
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          withAsterisk
          {...form.getInputProps('password')}
          mt="md"
        />
        <Space h="sm" />
        <Button fullWidth mt="xl" mb="md" type="submit">
          Sign in
        </Button>
        <Divider
          label="Don't have an account?"
          labelPosition="center"
          labelProps={{ fw: 400 }}
        />
        <Button
          fullWidth
          mt="md"
          variant="light"
          component={Link}
          href="/register"
        >
          Create account
        </Button>
      </Paper>
    </Container>
  );
}

'use client';

import {
  Button,
  Container,
  Divider,
  Paper,
  PasswordInput,
  Space,
  TextInput,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconUserCheck } from '@tabler/icons';
import { useRouter } from 'next/navigation';
import { authApi } from '@lib/api';

export default function Page() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 8
          ? null
          : 'Password must be at least 8 characters long',
    },
    validateInputOnBlur: true,
  });

  const submit = async (values: typeof form.values) => {
    try {
      const res = await authApi.register({ registerDto: values });
      router.push('/login');
      showNotification({
        title: 'Account created',
        message: `Account for ${res.email} created successfully. You can now sign in.`,
        autoClose: 5000,
        icon: <IconUserCheck size={18} />,
      });
    } catch (e) {
      form.setErrors({
        email: 'This email is already taken',
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
          Create account
        </Title>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          withAsterisk
          {...form.getInputProps('email')}
        />
        <TextInput
          label="First name"
          placeholder="Your first name"
          mt="md"
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label="Last name"
          placeholder="Your last name"
          mt="md"
          {...form.getInputProps('lastName')}
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
          Create account
        </Button>
        <Divider
          label="Already have an account?"
          labelPosition="center"
          labelProps={{ fw: 400 }}
        />
        <Button
          fullWidth
          mt="md"
          variant="light"
          component={Link}
          href="/login"
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}

'use client';

import { useState } from 'react';
import { Button, Flex, Modal, Textarea, Title } from '@mantine/core';
import { IconReceiptRefund } from '@tabler/icons';
import { isNotEmpty, useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { Order, returnsApi } from '@lib/api';

export default function ReturnFormModal({ order }: { order: Order }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      message: '',
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: {
      message: isNotEmpty('Message is required'),
    },
  });

  const submit = async () => {
    setLoading(true);
    await returnsApi.createReturn({
      returnCreateDto: {
        orderId: order.id,
        message: form.values.message,
      },
    });
    setLoading(false);
    router.refresh();
    setOpened(false);
  };

  return (
    <>
      <Button
        leftIcon={<IconReceiptRefund />}
        onClick={() => setOpened(true)}
        radius="xl"
        variant="light"
        mt={6}
      >
        Make return
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        title={<Title order={3}>Return order #{order.id}</Title>}
        withinPortal
        zIndex={10000}
      >
        <form onSubmit={form.onSubmit(submit)}>
          <Textarea
            label="Message"
            withAsterisk
            autosize
            minRows={5}
            maxRows={10}
            {...form.getInputProps('message')}
          />
          <Flex justify="space-between" mt="xl">
            <Button variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              loading={loading}
              disabled={!form.isValid() || !form.isDirty()}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

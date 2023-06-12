'use client';

import { useState, useTransition } from 'react';
import { Button, Flex, Modal, Textarea, Title } from '@mantine/core';
import { IconReceiptRefund } from '@tabler/icons';
import { isNotEmpty, useForm } from '@mantine/form';
import { Order } from '@lib/api';
import { createReturn as createReturnAction } from '@lib/actions/orders/createReturn';

export default function ReturnFormModal({ order }: { order: Order }) {
  const [opened, setOpened] = useState(false);
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      await createReturnAction(order.id, form.values.message);
      setOpened(false);
    });
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
              loading={isPending}
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

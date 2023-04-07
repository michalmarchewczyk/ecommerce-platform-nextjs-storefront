'use client';

import {
  Button,
  Divider,
  Flex,
  Modal,
  Rating,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconStar } from '@tabler/icons';
import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { productRatingsApi, usersApi } from '@lib/api';

export default function ProductRatingForm({
  productId,
}: {
  productId: number;
}) {
  const [opened, setOpened] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const { error, isLoading } = useSWR('user', () => usersApi.getCurrentUser());

  const saveToWishlist = async () => {
    await productRatingsApi.createProductRating({
      productId,
      productRatingDto: { rating, comment },
    });
    router.refresh();
    setOpened(false);
    showNotification({
      title: 'Created rating',
      message: `Created rating for product`,
      autoClose: 3000,
      icon: <IconStar size={18} />,
    });
    setTimeout(() => {
      router.refresh();
    }, 1100);
  };

  if (isLoading || error) {
    return (
      <Tooltip label="Sign in to add rating" withArrow>
        <div>
          <Button
            leftIcon={<IconStar />}
            radius="xl"
            size="lg"
            variant="outline"
            disabled
          >
            Add rating
          </Button>
        </div>
      </Tooltip>
    );
  }

  return (
    <>
      <Button
        leftIcon={<IconStar />}
        radius="xl"
        size="lg"
        variant="outline"
        onClick={() => setOpened(true)}
      >
        Add rating
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        centered
        title={<Title order={3}>Create rating</Title>}
        withinPortal
        zIndex={10000}
        size="sm"
      >
        <Rating value={rating} onChange={setRating} size="lg" mb="md" mt="lg" />
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
          label="Comment"
          autosize
          minRows={4}
          maxRows={8}
        />
        <Divider mx="-lg" my="md" />
        <Flex justify="space-between" wrap="wrap" rowGap="sm">
          <Button onClick={() => setOpened(false)} variant="light">
            Cancel
          </Button>
          <Button onClick={saveToWishlist}>Create</Button>
        </Flex>
      </Modal>
    </>
  );
}

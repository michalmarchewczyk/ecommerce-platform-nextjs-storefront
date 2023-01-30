'use client';

import {
  Button,
  Divider,
  Flex,
  Modal,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconHeartPlus, IconPlus } from '@tabler/icons';
import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { wishlistsApi } from '@lib/api';

export default function ProductWishlistButton({
  productId,
}: {
  productId: number;
}) {
  const [opened, setOpened] = useState(false);
  const [inputOpened, setInputOpened] = useState(false);
  const [wishlistName, setWishlistName] = useState('');
  const router = useRouter();

  const {
    data: wishlists,
    error,
    mutate,
  } = useSWR('wishlists', () => wishlistsApi.getUserWishlists());

  const createWishlist = async () => {
    await wishlistsApi.createWishlist({
      wishlistCreateDto: { name: wishlistName, productIds: [] },
    });
    setInputOpened(false);
    await mutate();
  };

  const saveToWishlist = async (wishlistId: number) => {
    const newProductIds = wishlists
      ?.find((wishlist) => wishlist.id === wishlistId)
      ?.products.map((product) => product.id);
    newProductIds?.push(productId);
    if (!newProductIds) return;
    await wishlistsApi.updateWishlist({
      id: wishlistId,
      wishlistUpdateDto: { productIds: newProductIds },
    });
    setOpened(false);
    setInputOpened(false);
    showNotification({
      title: 'Saved to wishlist',
      message: `Saved product to wishlist`,
      autoClose: 3000,
      icon: <IconHeartPlus size={18} />,
    });
    router.refresh();
  };

  if (error) {
    return (
      <Tooltip label="Sign in to save product" withArrow>
        <div>
          <Button
            leftIcon={<IconHeartPlus />}
            radius="xl"
            size="lg"
            variant="outline"
            disabled
          >
            Save
          </Button>
        </div>
      </Tooltip>
    );
  }

  return (
    <>
      <Button
        leftIcon={<IconHeartPlus />}
        radius="xl"
        size="lg"
        variant="outline"
        onClick={() => setOpened(true)}
      >
        Save
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setInputOpened(false);
        }}
        centered
        title={<Title order={3}>Save to wishlist</Title>}
        withinPortal
        zIndex={10000}
        size="sm"
      >
        {wishlists?.length === 0 && (
          <Text color="gray.6" align="center" py="lg" fz={20} fw={500}>
            You don&apos;t have any wishlists yet
          </Text>
        )}
        <Flex direction="column" gap="sm">
          {wishlists?.map((wishlist) => (
            <Button
              key={wishlist.id}
              variant="outline"
              radius="xl"
              onClick={() => saveToWishlist(wishlist.id)}
            >
              {wishlist.name}
            </Button>
          ))}
        </Flex>
        <Divider mx="-lg" my="md" />
        {!inputOpened && (
          <Button
            leftIcon={<IconPlus />}
            radius="xl"
            w="100%"
            variant="light"
            onClick={() => setInputOpened(true)}
          >
            Create new wishlist
          </Button>
        )}
        {inputOpened && (
          <Flex justify="space-between" wrap="wrap" rowGap="sm" mt={-4}>
            <TextInput
              label="New wishlist name"
              placeholder="Favorite"
              w="100%"
              value={wishlistName}
              onChange={(e) => setWishlistName(e.currentTarget.value)}
            />
            <Button onClick={() => setInputOpened(false)} variant="light">
              Cancel
            </Button>
            <Button onClick={createWishlist}>Save</Button>
          </Flex>
        )}
      </Modal>
    </>
  );
}

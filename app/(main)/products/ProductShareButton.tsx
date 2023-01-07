'use client';

import { Button, Menu, Text } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconCopy,
  IconShare,
} from '@tabler/icons';
import { useClipboard } from '@mantine/hooks';

export default function ProductShareButton() {
  const clipboard = useClipboard();

  return (
    <Menu radius="xl" shadow="lg" withinPortal position="bottom">
      <Menu.Target>
        <Button
          leftIcon={<IconShare />}
          radius="xl"
          size="lg"
          variant="outline"
        >
          Share
        </Button>
      </Menu.Target>
      <Menu.Dropdown sx={{ padding: '7px' }}>
        <Menu.Item
          icon={<IconBrandFacebook size={24} />}
          component="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
          target="_blank"
        >
          <Text fw={500} fz={18}>
            Facebook
          </Text>
        </Menu.Item>
        <Menu.Item
          icon={<IconBrandTwitter size={24} />}
          component="a"
          href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
          target="_blank"
        >
          <Text fw={500} fz={18}>
            Twitter
          </Text>
        </Menu.Item>
        <Menu.Item
          icon={<IconCopy size={24} />}
          onClick={() => clipboard.copy(window.location.href)}
        >
          <Text fw={500} fz={18}>
            {clipboard.copied ? 'Copied' : 'Copy link'}
          </Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

import Link from 'next/link';
import { Return } from '@lib/api';
import { Box, Flex, Paper, Text } from '@lib/components/wrappers';
import ReturnBadge from './ReturnBadge';

export default function ReturnsListItem({ item }: { item: Return }) {
  return (
    <Paper
      withBorder
      p="md"
      component={Link}
      href={`/account/orders/${item.order.id}`}
      sx={{
        transition: 'box-shadow 0.2s var(--mantine-transition-timing-function)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 'var(--mantine-shadow-md)',
        },
      }}
    >
      <Flex align="center" gap="md">
        <Text fw={600} fz={20}>
          Return for order #{item.order.id}
        </Text>
        <ReturnBadge status={item.status} />
        <Box sx={{ flex: 1 }} />
        <Text fw={500} fz={16} c="gray.6">
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(item.created))}
        </Text>
      </Flex>
    </Paper>
  );
}

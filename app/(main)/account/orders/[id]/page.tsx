import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons';
import { Button, Title } from '../../../../../lib/components/wrappers';

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <Button
        variant="outline"
        component={Link}
        href="/account/orders"
        radius="xl"
        mb="sm"
        leftIcon={<IconArrowLeft />}
      >
        View all orders
      </Button>
      <Title order={2}>Order #{id}</Title>
    </>
  );
}

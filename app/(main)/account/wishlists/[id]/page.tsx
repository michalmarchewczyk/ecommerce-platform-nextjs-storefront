import { Title } from '../../../../../lib/components/wrappers';

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Title order={2} mb="md">
      Wishlist #{id}
    </Title>
  );
}

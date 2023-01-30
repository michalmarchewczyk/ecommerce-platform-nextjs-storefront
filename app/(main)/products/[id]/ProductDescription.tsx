import { Product } from '@lib/api';
import { Box, Text } from '@lib/components/wrappers';
import PageNavigationAnchor from '@lib/components/ui/PageNavigationAnchor';

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <Box mt="lg" mb="xl" pos="relative">
      <Text fz={24} fw={600} mb="lg">
        Description
      </Text>
      <PageNavigationAnchor label="description" />
      <Text fz={16} fw={400} lh={1.5}>
        {product.description}
      </Text>
    </Box>
  );
}

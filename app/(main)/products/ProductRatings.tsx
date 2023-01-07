import { Box, Text } from '../../../lib/components/wrappers';
import ProductNavigationAnchor from './ProductNavigationAnchor';
import { Product } from '../../../lib/api';

export default function ProductRatings({ product }: { product: Product }) {
  return (
    <Box mt="lg" mb="xl">
      <Text fz={24} fw={600} mb="lg">
        Ratings
      </Text>
      <ProductNavigationAnchor label="ratings" />
      <Text fz={16} fw={400} lh={1.5}>
        {JSON.stringify(product.ratings)}
      </Text>
    </Box>
  );
}

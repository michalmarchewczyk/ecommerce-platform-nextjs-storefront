import { Product } from '../../../lib/api';
import { Box, Text } from '../../../lib/components/wrappers';
import ProductNavigationAnchor from './ProductNavigationAnchor';

export default function ProductDescription({ product }: { product: Product }) {
  return (
    <Box mt="lg" mb="xl">
      <Text fz={24} fw={600} mb="lg">
        Description
      </Text>
      <ProductNavigationAnchor label="description" />
      <Text fz={16} fw={400} lh={1.5}>
        {product.description}
      </Text>
    </Box>
  );
}

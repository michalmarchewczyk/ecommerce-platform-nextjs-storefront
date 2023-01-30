import { Product } from '@lib/api';
import { Box, Table, Text } from '@lib/components/wrappers';
import PageNavigationAnchor from '@lib/components/ui/PageNavigationAnchor';
import styles from './ProductDetails.module.scss';

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <Box mt="lg" mb="xl" pos="relative">
      <Text fz={24} fw={600} mb="lg">
        Details
      </Text>
      <PageNavigationAnchor label="details" />
      {product.attributes.length === 0 && (
        <Text fz={36} fw={400} c="gray.6" align="center">
          No details available
        </Text>
      )}
      {product.attributes.length > 0 && (
        <Table
          striped
          withBorder
          withColumnBorders
          fontSize="md"
          verticalSpacing="sm"
          className={styles.table}
        >
          <tbody>
            {product.attributes.map((attribute) => (
              <tr key={attribute.id}>
                <td>{attribute.type.name}</td>
                <td>{attribute.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
}

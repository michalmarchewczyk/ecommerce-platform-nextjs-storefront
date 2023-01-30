import { Box, Flex, Rating, Text, Title } from '@lib/components/wrappers';
import Price from '@lib/components/ui/Price';
import { Product } from '@lib/api';
import ProductActions from './ProductActions';

export default function ProductHeader({
  product,
  ratings,
}: {
  product: Product;
  ratings: { average: number; count: number };
}) {
  return (
    <Flex
      sx={{
        flex: 1,
        '@media (max-width: 804px)': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      }}
      miw={320}
      direction="column"
      justify="space-between"
      pt="xs"
      pb="xs"
    >
      <Box>
        <Title order={3} fz={32} mb="md" lineClamp={2}>
          {product.name}
        </Title>
        <Flex>
          <Rating
            value={ratings.average}
            fractions={2}
            readOnly
            size="md"
            ml={-3}
          />
          <Text fw={400} fz="md" ml={4} c="gray.7" mt={-2}>
            ({ratings.count})
          </Text>
        </Flex>
      </Box>

      <Box>
        <Text fw={800} fz={44} mb="lg" align="right">
          {/* @ts-expect-error Server Component */}
          <Price price={product.price} />
        </Text>
        <ProductActions product={product} />
      </Box>
    </Flex>
  );
}

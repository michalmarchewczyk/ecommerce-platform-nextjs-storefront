import { productRatingsApi } from '@lib/api';
import { Flex, Rating, Text } from '../wrappers';

async function getProductRatings(id: number) {
  const ratings = await productRatingsApi.getProductRatings(
    { productId: id },
    {
      next: {
        revalidate: 1,
      },
    },
  );
  const average =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  const count = ratings.length;
  return { average, count };
}

export default async function ProductRating({
  productId,
}: {
  productId: number;
}) {
  const ratings = await getProductRatings(productId);
  return (
    <Flex align="center">
      <Rating value={ratings.average} fractions={2} readOnly ml={-3} />
      <Text fw={400} fz="md" ml={4} c="gray.7">
        ({ratings.count})
      </Text>
    </Flex>
  );
}

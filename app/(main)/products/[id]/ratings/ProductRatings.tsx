import {
  Box,
  Divider,
  Flex,
  Paper,
  Progress,
  Rating,
  Stack,
  Text,
} from '@lib/components/wrappers';
import PageNavigationAnchor from '@lib/components/ui/PageNavigationAnchor';
import { Product, productRatingsApi } from '@lib/api';
import ProductRatingItem from './ProductRatingItem';
import ProductRatingForm from './ProductRatingForm';

async function getProductRatings(id: number) {
  const ratings = await productRatingsApi.getProductRatings(
    { productId: id },
    { next: { revalidate: 1 } },
  );
  const average =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
  const count = ratings.length;
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  return { average, count, ratings };
}

export default async function ProductRatings({
  product,
}: {
  product: Product;
}) {
  const { average, count, ratings } = await getProductRatings(product.id);
  const withComments = ratings.filter((r) => r.comment);

  const getRatingBar = (rating: number) => {
    const ratingCount = ratings.filter((r) => r.rating === rating).length;
    const percent = (ratingCount / count) * 100 || 0;
    return (
      <Flex w={260} align="center" gap="sm">
        <Text fz={16} fw={400}>
          {rating}
        </Text>
        <Progress value={percent} color="indigo" size="md" sx={{ flex: 1 }} />
        <Text fz={16} fw={400} color="gray.7" w={90}>
          {ratingCount} ({percent.toFixed(0)}%)
        </Text>
      </Flex>
    );
  };

  return (
    <Box mt="lg" mb="xl" pos="relative">
      <Text fz={24} fw={600} mb="lg">
        Ratings
      </Text>
      <PageNavigationAnchor label="ratings" />
      <Paper withBorder w="100%" px="sm" mb="md">
        <Flex align="center">
          <Box p="md">
            <Text fz={28} fw={600} mb="xs">
              {average.toFixed(1)} / 5
            </Text>
            <Rating value={average} fractions={4} readOnly size="md" ml={-3} />
            <Text fz={16} fw={400} mt="md" mb="lg">
              {count} ratings
            </Text>
          </Box>
          <Divider
            orientation="vertical"
            mx="sm"
            sx={{ '@media (max-width: 750px)': { display: 'none' } }}
          />
          <Stack
            spacing={2}
            p="md"
            sx={{ '@media (max-width: 750px)': { display: 'none' } }}
          >
            {getRatingBar(5)}
            {getRatingBar(4)}
            {getRatingBar(3)}
            {getRatingBar(2)}
            {getRatingBar(1)}
          </Stack>
          <Box sx={{ flex: 1 }} />
          <Divider orientation="vertical" mx="sm" />
          <Box px="sm">
            <ProductRatingForm productId={product.id} />
          </Box>
        </Flex>
      </Paper>
      {withComments.length === 0 && (
        <Text
          fz={36}
          color="gray.6"
          fw={400}
          align="center"
          w="100%"
          h={160}
          lh="160px"
        >
          No comments found
        </Text>
      )}
      <Stack w="100%" spacing="md">
        {withComments.length > 0 && (
          <>
            {withComments.map((rating) => (
              <ProductRatingItem key={rating.id} rating={rating} />
            ))}
          </>
        )}
      </Stack>
    </Box>
  );
}

import { ProductRating } from '@lib/api';
import { Flex, Paper, Rating, Text } from '@lib/components/wrappers';

export default function ProductRatingItem({
  rating,
}: {
  rating: ProductRating;
}) {
  return (
    <Paper withBorder p="md" px="lg">
      <Flex mb={2} justify="space-between">
        <Rating value={rating.rating} readOnly ml={-2} />
        <Text fw={400} c="gray.7">
          {new Date(rating.updated).toLocaleDateString()}
        </Text>
      </Flex>
      <Flex gap="xs" mb="xs">
        {rating.user.firstName && rating.user.lastName && (
          <Text fw={700}>
            {rating.user.firstName} {rating.user.lastName}
          </Text>
        )}
        <Text fw={500} c="gray.7">
          {rating.user.email}
        </Text>
      </Flex>

      <Text fw={400} c="gray.9">
        {rating.comment}
      </Text>
    </Paper>
  );
}

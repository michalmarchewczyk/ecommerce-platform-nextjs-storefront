import {
  Box,
  Divider,
  Flex,
  Paper,
  Skeleton,
  Stack,
  Text,
} from '@lib/components/wrappers';
import PageNavigationAnchor from '@lib/components/ui/PageNavigationAnchor';

export default function ProductRatingsLoading() {
  return (
    <Box mt="lg" mb="xl">
      <Text fz={24} fw={600} mb="lg">
        Ratings
      </Text>
      <PageNavigationAnchor label="ratings" />
      <Paper withBorder w="100%" px="sm" mb="md">
        <Flex>
          <Box p="md">
            <Skeleton mb="sm" width={107} height={40} mt={5} />
            <Skeleton width={107} height={20} />
            <Skeleton mt="md" width={107} height={25} />
          </Box>
          <Divider orientation="vertical" mx="sm" />
          <Stack spacing={2} p="md">
            <Skeleton width={260} height={15} my={5} />
            <Skeleton width={260} height={15} my={5} />
            <Skeleton width={260} height={15} my={5} />
            <Skeleton width={260} height={15} my={5} />
            <Skeleton width={260} height={15} my={5} />
          </Stack>
        </Flex>
      </Paper>
      <Stack w="100%" spacing="md">
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
      </Stack>
    </Box>
  );
}

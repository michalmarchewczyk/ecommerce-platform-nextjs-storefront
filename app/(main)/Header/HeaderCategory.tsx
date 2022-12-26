import { IconChevronDown } from '@tabler/icons';
import Link from 'next/link';
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  HoverCard,
  HoverCardTarget,
  HoverCardDropdown,
  Text,
  Title,
} from '../../../lib/components/wrappers';
import styles from './HeaderCategory.module.scss';
import { categoriesApi } from '../../../lib/api';

async function getCategory(categoryId: number) {
  try {
    return await categoriesApi.getCategory({ id: categoryId });
  } catch (error) {
    return null;
  }
}

export default async function HeaderCategory({
  categoryId,
}: {
  categoryId: number;
}) {
  const category = await getCategory(categoryId);

  if (!category) {
    return null;
  }

  return (
    <HoverCard
      width={600}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCardTarget>
        <Link href={`/categories/${category.id}`} className={styles.link}>
          <Center inline>
            <Box component="span" mr={5}>
              {category.name}
            </Box>
            <IconChevronDown size={16} />
          </Center>
        </Link>
      </HoverCardTarget>

      <HoverCardDropdown sx={{ overflow: 'hidden' }}>
        <Group position="apart" px="0" noWrap align="flex-start">
          <div>
            <Title order={4}>{category.name}</Title>
            <Text weight={500} lineClamp={2}>
              {category.description}
            </Text>
          </div>
          <div>
            <Button
              component={Link}
              href={`/categories/${category.id}`}
              variant="subtle"
            >
              View products
            </Button>
          </div>
        </Group>

        <Divider my="sm" mx="-md" />
        <div>{JSON.stringify(category.childCategories)}</div>
      </HoverCardDropdown>
    </HoverCard>
  );
}

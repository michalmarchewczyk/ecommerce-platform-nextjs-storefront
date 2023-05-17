import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import Link from 'next/link';
import { categoriesApi } from '@lib/api';
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
  NavLink,
} from '../../wrappers';
import styles from './HeaderCategory.module.scss';

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

  if (category.childCategories.length === 0) {
    return (
      <Link
        href={`/categories/${category.id}`}
        className={styles.link}
        prefetch
      >
        {category.name}
      </Link>
    );
  }

  return (
    <HoverCard
      width={360}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
      closeDelay={50}
      transitionDuration={100}
      zIndex={2000}
    >
      <HoverCardTarget>
        <Link
          href={`/categories/${category.id}`}
          className={styles.link}
          prefetch
        >
          <Center inline>
            <Box component="span" mr={5}>
              {category.name}
            </Box>
            <IconChevronDown size={16} />
          </Center>
        </Link>
      </HoverCardTarget>

      <HoverCardDropdown sx={{ overflow: 'hidden', marginTop: -16 }}>
        <Group position="apart" px="0" noWrap align="center">
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
              variant="outline"
              radius="xl"
              prefetch
            >
              View products
            </Button>
          </div>
        </Group>

        <Divider my="sm" mx="-md" />
        <Box px={0} mx={-8}>
          {category.childCategories.map((childCategory) => (
            <NavLink
              key={childCategory.id}
              label={<Text weight={500}>{childCategory.name}</Text>}
              rightSection={<IconChevronRight size={18} stroke={2} />}
              component={Link}
              href={`/categories/${childCategory.id}`}
              prefetch
            />
          ))}
        </Box>
      </HoverCardDropdown>
    </HoverCard>
  );
}

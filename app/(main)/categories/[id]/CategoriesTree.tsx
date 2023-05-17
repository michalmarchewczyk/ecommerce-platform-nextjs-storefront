import Link from 'next/link';
import { categoriesApi, Category } from '@lib/api';
import { Card, List, ListItem, Text } from '@lib/components/wrappers';
import styles from './CategoriesTree.module.scss';

async function getCategory(id: number) {
  return categoriesApi.getCategory({ id });
}

export default async function CategoriesTree({
  categoryId,
}: {
  categoryId: number;
}) {
  const category = await getCategory(categoryId);
  category.parentCategory &&= await getCategory(category.parentCategory.id);
  category.childCategories.sort((a, b) => a.name.localeCompare(b.name));
  const siblingCategories = category.parentCategory?.childCategories ?? [];
  siblingCategories.sort((a, b) => a.name.localeCompare(b.name));
  const siblingCategoriesBefore = siblingCategories.slice(
    0,
    siblingCategories.findIndex((c) => c.id === category.id),
  );
  const siblingCategoriesAfter = siblingCategories.slice(
    siblingCategories.findIndex((c) => c.id === category.id) + 1,
  );

  const getCategoryLink = (cat: Category) => (
    <Text
      component={Link}
      href={`/categories/${cat.id}`}
      className={styles.link}
      fw={400}
      prefetch
    >
      {cat.name}
    </Text>
  );

  return (
    <Card withBorder w={250} p="sm">
      {category.parentCategory && getCategoryLink(category.parentCategory)}
      <List withPadding={!!category.parentCategory} listStyleType="none">
        {siblingCategoriesBefore.map((siblingCategory) => (
          <ListItem key={siblingCategory.id} pt={2}>
            {getCategoryLink(siblingCategory)}
          </ListItem>
        ))}
        <ListItem pt={4} pb={4}>
          <Text fw={600}>{category.name}</Text>
          <List withPadding listStyleType="none" pt={2}>
            {category.childCategories.map((siblingCategory) => (
              <ListItem key={siblingCategory.id}>
                {getCategoryLink(siblingCategory)}
              </ListItem>
            ))}
          </List>
        </ListItem>
        {siblingCategoriesAfter.map((siblingCategory) => (
          <ListItem key={siblingCategory.id} pt={2}>
            {getCategoryLink(siblingCategory)}
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

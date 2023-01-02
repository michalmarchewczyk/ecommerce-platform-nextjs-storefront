import Link from 'next/link';
import { NavLink, Text } from '../../../lib/components/wrappers';
import { categoriesApi } from '../../../lib/api';

async function getCategory(categoryId: number) {
  try {
    return await categoriesApi.getCategory({ id: categoryId });
  } catch (error) {
    return null;
  }
}

export default async function DrawerCategory({
  categoryId,
}: {
  categoryId: number;
}) {
  const category = await getCategory(categoryId);

  if (!category) {
    return <></>;
  }

  if (category.childCategories.length === 0) {
    return (
      <NavLink
        label={
          <Text weight={500} fz="md">
            {category.name}
          </Text>
        }
        component={Link}
        href={`/categories/${category.id}`}
      />
    );
  }

  return (
    <NavLink
      label={
        <Text weight={500} fz="md">
          {category.name}
        </Text>
      }
      component={Link}
      href={`/categories/${category.id}`}
    >
      {category.childCategories.map((childCategory) => (
        <div key={childCategory.id}>
          <NavLink
            label={
              <Text weight={500} fz="md">
                {childCategory.name}
              </Text>
            }
            component={Link}
            href={`/categories/${childCategory.id}`}
          />
        </div>
      ))}
    </NavLink>
  );
}
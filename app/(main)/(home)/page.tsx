import { categoriesApi } from '@lib/api';
import CategorySection from './CategorySection';

export const revalidate = 20;

async function getFeaturedCategories() {
  try {
    const categoryGroups = await categoriesApi.getCategoryGroups();
    return categoryGroups.find((g) => g.name === 'featured')?.categories ?? [];
  } catch (e) {
    return [];
  }
}

export default async function Page() {
  const featuredCategories = await getFeaturedCategories();
  return (
    <>
      {featuredCategories?.map((c) => (
        <div key={c.id}>
          {/* @ts-expect-error Server Component */}
          <CategorySection categoryId={c.id} />
        </div>
      ))}
    </>
  );
}

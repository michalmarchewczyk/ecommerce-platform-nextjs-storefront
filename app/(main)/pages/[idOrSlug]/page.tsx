import { remark } from 'remark';
import html from 'remark-html';
import { pagesApi, Page } from '@lib/api';
import { Container, Text, Title } from '@lib/components/wrappers';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';

async function getPageById(id: number) {
  try {
    const page = await pagesApi.getPage({ id });
    const contentHtml = (
      await remark().use(html).process(page.content)
    ).toString();
    return { ...page, contentHtml };
  } catch (error) {
    return notFound();
  }
}

async function getPageBySlug(slug: string) {
  try {
    const pages = await pagesApi.getPages({ cache: 'no-store' });
    const page = pages.find((p) => p.slug === slug);
    if (!page) {
      return notFound();
    }
    const contentHtml = (
      await remark().use(html).process(page.content)
    ).toString();
    return { ...page, contentHtml };
  } catch (error) {
    return notFound();
  }
}

async function getPage(idOrSlug: string) {
  let page: Page & { contentHtml: string };
  if (Number.isNaN(parseInt(idOrSlug, 10))) {
    page = await getPageBySlug(idOrSlug);
  } else {
    page = await getPageById(parseInt(idOrSlug, 10));
  }
  return page;
}

export async function generateMetadata({
  params: { idOrSlug },
}: {
  params: { idOrSlug: string };
}) {
  if (!idOrSlug) return {};
  const page = await getPage(idOrSlug);

  return { title: page.title };
}

export default async function Page({
  params: { idOrSlug },
}: {
  params: { idOrSlug: string };
}) {
  if (!idOrSlug) return null;
  const page = await getPage(idOrSlug);

  return (
    <Container size="md" px="lg" pt="md">
      {page.content.trimStart().startsWith('# ') ? null : (
        <Title order={1}>{page.title}</Title>
      )}
      <Text
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        fw={400}
        className={styles.content}
      />
    </Container>
  );
}

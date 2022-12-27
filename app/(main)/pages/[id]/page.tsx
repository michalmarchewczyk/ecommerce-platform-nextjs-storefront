import { remark } from 'remark';
import html from 'remark-html';
import { pagesApi } from '../../../../lib/api';
import { Container, Text, Title } from '../../../../lib/components/wrappers';
import styles from './page.module.scss';

export async function generateStaticParams() {
  const pages = await pagesApi.getPages();
  return pages.map((page) => ({
    id: page.id.toString(),
  }));
}

async function getPage(id: number) {
  const page = await pagesApi.getPage({ id });
  const contentHtml = (
    await remark().use(html).process(page.content)
  ).toString();
  return { ...page, contentHtml };
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const page = await getPage(parseInt(id, 10));

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

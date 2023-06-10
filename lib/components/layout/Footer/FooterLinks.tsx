import Link from 'next/link';
import { pagesApi } from '@lib/api';
import { Text } from '../../wrappers';
import styles from './FooterLinks.module.scss';

async function getPageGroups() {
  try {
    const pageGroups = await pagesApi.getPageGroups();
    return pageGroups.filter((g) =>
      ['orders', 'info', 'my account'].includes(g.name),
    );
  } catch (e) {
    return [];
  }
}

export default async function FooterLinks() {
  const pageGroups = await getPageGroups();

  return pageGroups.map((group) => {
    const links = group.pages.map((page) => (
      <Text
        key={page.id}
        className={styles.link}
        component={Link}
        href={page.slug ? `/${page.slug}` : `/pages/${page.id}`}
        fw={400}
        prefetch
      >
        {page.title}
      </Text>
    ));

    return (
      <div className={styles.wrapper} key={group.id}>
        <Text className={styles.title}>{group.name}</Text>
        {links}
      </div>
    );
  });
}

import { Header, Group, Container } from '../../../lib/components/wrappers';
import Logo from '../Logo';
import styles from './MainHeader.module.scss';
import AccountCard from './AccountCard';
import CartCard from './CartCard';
import HeaderCategory from './HeaderCategory';
import { categoriesApi } from '../../../lib/api';

async function getMainCategories() {
  const categoryGroups = await categoriesApi.getCategoryGroups();
  return categoryGroups.find((g) => g.name === 'main')?.categories;
}

export default async function MainHeader() {
  const mainCategories = await getMainCategories();
  return (
    <Header height={64} px="md">
      <Container sx={{ height: '100%' }} size="xl" px={0}>
        <Group position="apart" sx={{ height: '100%' }}>
          <Logo />
          <Group
            sx={{ height: '100%' }}
            spacing={0}
            className={styles.hiddenMobile}
          >
            {mainCategories?.map((c) => (
              <div className={styles.headerCategory} key={c.id}>
                {/* @ts-expect-error Server Component */}
                <HeaderCategory categoryId={c.id} />
              </div>
            ))}
          </Group>

          <Group className={styles.hiddenMobile} sx={{ height: '100%' }}>
            <div>
              {/* @ts-expect-error Server Component */}
              <AccountCard />
            </div>
            <div>
              {/* @ts-expect-error Server Component */}
              <CartCard />
            </div>
          </Group>
        </Group>
      </Container>
    </Header>
  );
}

import { Header, Group, Container } from '../../../lib/components/wrappers';
import Logo from '../Logo';
import styles from './MainHeader.module.scss';
import AccountCard from './AccountCard';
import CartCard from './CartCard';
import HeaderCategory from './HeaderCategory';
import { categoriesApi } from '../../../lib/api';
import HeaderDrawer from './HeaderDrawer';
import DrawerCategory from './DrawerCategory';

async function getMainCategories() {
  const categoryGroups = await categoriesApi.getCategoryGroups();
  return categoryGroups.find((g) => g.name === 'main')?.categories;
}

export default async function MainHeader() {
  const mainCategories = await getMainCategories();
  return (
    <Header height={64} px="0" fixed className={styles.header}>
      <Container sx={{ height: '100%' }} size="xl" px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <div className={styles.hiddenMobile}>
            <Logo />
          </div>
          <div className={styles.hiddenDesktop}>
            <HeaderDrawer>
              {mainCategories?.map((c) => (
                <div key={c.id}>
                  {/* @ts-expect-error Server Component */}
                  <DrawerCategory categoryId={c.id} />
                </div>
              ))}
            </HeaderDrawer>
          </div>
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

          <Group sx={{ height: '100%' }}>
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

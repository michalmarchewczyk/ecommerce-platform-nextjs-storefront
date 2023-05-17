import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons';
import Logo from '@lib/components/ui/Logo';
import { ActionIcon, Container, Group, Text } from '../../wrappers';
import styles from './MainFooter.module.scss';
import FooterLinks from './FooterLinks';

export default function MainFooter() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner} size="xl" px="md">
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.groups}>
          {/* @ts-expect-error Server Component */}
          <FooterLinks />
        </div>
      </Container>
      <Container className={styles.afterFooter} size="xl" px="md">
        <Text color="dimmed" size="sm">
          Created by Michał Marchewczyk
        </Text>

        <Group spacing={0} className={styles.social} position="right" noWrap>
          <div>
            <ActionIcon size="lg">
              <IconBrandTwitter size={22} stroke={2} />
            </ActionIcon>
          </div>
          <div>
            <ActionIcon size="lg">
              <IconBrandYoutube size={22} stroke={2} />
            </ActionIcon>
          </div>
          <div>
            <ActionIcon size="lg">
              <IconBrandInstagram size={22} stroke={2} />
            </ActionIcon>
          </div>
        </Group>
      </Container>
    </footer>
  );
}

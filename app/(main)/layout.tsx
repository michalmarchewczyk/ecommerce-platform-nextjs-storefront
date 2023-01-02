import MainHeader from './Header/MainHeader';
import MainFooter from './Footer/MainFooter';
import { Container } from '../../lib/components/wrappers';

export const revalidate = 0;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MainHeader />
      <Container size="xl" mt={80} px="md" mih="calc(100vh - 500px)">
        {children}
      </Container>
      <MainFooter />
    </>
  );
}
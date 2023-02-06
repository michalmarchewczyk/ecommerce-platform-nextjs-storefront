import MainHeader from '@lib/components/layout/Header/MainHeader';
import MainFooter from '@lib/components/layout/Footer/MainFooter';
import { Container } from '@lib/components/wrappers';

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

import MainHeader from './Header/MainHeader';
import MainFooter from './Footer/MainFooter';

export const revalidate = 0;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MainHeader />
      <main>{children}</main>
      <MainFooter />
    </>
  );
}

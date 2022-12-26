import MainHeader from './Header/MainHeader';
import MainFooter from './Footer/MainFooter';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MainHeader />
      <main>{children}</main>
      <MainFooter />
    </>
  );
}

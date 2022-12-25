import MainHeader from './MainHeader';

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
    </>
  );
}

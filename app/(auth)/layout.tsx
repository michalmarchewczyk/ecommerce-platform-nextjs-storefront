import Background from '@lib/components/ui/Background';
import BigLogo from '@lib/components/ui/BigLogo';
import { Center } from '@lib/components/wrappers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BigLogo />

      {/*<main>*/}
      <Center style={{ height: '100vh' }}>{children}</Center>
      {/*</main>*/}

      <Background />
    </>
  );
}

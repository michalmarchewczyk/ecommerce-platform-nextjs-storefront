import Background from './Background';
import BigLogo from './BigLogo';
import { Center } from '../../lib/components/wrappers';

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

import Link from 'next/link';
import styles from './BigLogo.module.scss';

export default function BigLogo() {
  return (
    <Link href="/">
      <h1 className={styles.logo}>
        Ecommerce <br />
        Platform
      </h1>
    </Link>
  );
}

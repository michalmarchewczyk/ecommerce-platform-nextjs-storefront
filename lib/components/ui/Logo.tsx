import Link from 'next/link';
import styles from './Logo.module.scss';

export default function Logo() {
  return (
    <Link href="/">
      <h1 className={styles.logo}>
        Ecommerce <br />
        Platform
      </h1>
    </Link>
  );
}

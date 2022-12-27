import { Poppins, Roboto } from '@next/font/google';
import RootStyleRegistry from './emotion';
import './global.scss';

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
});
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className={`${poppins.className} ${roboto.className}`}>
      <head>
        <title>Ecommerce Platform</title>
      </head>
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}

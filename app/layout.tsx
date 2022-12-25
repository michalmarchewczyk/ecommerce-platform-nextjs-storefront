import { Poppins } from '@next/font/google';
import RootStyleRegistry from './emotion';
import './global.scss';

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US" className={poppins.className}>
      <head>
        <title>Ecommerce platform</title>
      </head>
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}

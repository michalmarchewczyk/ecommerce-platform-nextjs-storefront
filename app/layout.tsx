import { Poppins, Roboto } from 'next/font/google';
import RootStyleRegistry from './emotion';
import './global.scss';

const poppins = Poppins({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
  variable: '--font-roboto',
});

export const metadata = {
  title: {
    template: '%s - Ecommerce Platform',
    default: 'Ecommerce Platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-US"
      className={`${poppins.className} ${roboto.className} ${poppins.variable} ${roboto.variable}`}
    >
      <head>
        <title>Ecommerce Platform</title>
      </head>
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
      </body>
    </html>
  );
}

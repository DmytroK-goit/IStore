'use client';
import './globals.css';
import Link from 'next/link';
import { Providers } from '../providers';
import { Header } from '@/components/header/header';
import { Flip, ToastContainer } from 'react-toastify';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const bgImage =
    pathname === '/contactUs'
      ? "url('/img/BGcontactUs.jpg')"
      : pathname === '/products'
        ? "url('/img/BGShop.jpg')"
        : "url('/img/bg-store.jpg')";

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/react-toastify/dist/ReactToastify.min.css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  }, []);

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/Goldman-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        <link rel="preload" href="/_next/static/css/715be398208dca58.css" as="style" />
        <link rel="preload" href="/_next/static/css/b1b5a54257709856.css" as="style" />
      </head>
      <body className="bg-gray-900 text-white flex flex-col min-h-screen ">
        <Providers>
          <ToastContainer position="top-right" autoClose={3000} transition={Flip} />
          <Header />

          <main
            className="flex-1 p-5 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: bgImage }}
          >
            {children}
          </main>

          <footer
            className="flex flex-col items-center justify-center gap-2 h-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/bg_footer.jpg')" }}
          >
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} ISTORE. All rights reserved.
            </p>
            <Link href="/contactUs" className="text-sm text-yellow-400 hover:underline">
              Contact Us
            </Link>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

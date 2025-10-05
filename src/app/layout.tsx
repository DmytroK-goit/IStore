'use client';
import './globals.css';
import Link from 'next/link';
import { Providers } from '../providers';
import { Header } from '@/components/header/header';
import { Flip, ToastContainer } from 'react-toastify';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const bgImage =
    pathname === '/contactUs'
      ? "url('/img/BGcontactUs.webp')"
      : pathname === '/products'
        ? "url('/img/BGShop.webp')"
        : "url('/img/bg-store.webp')";

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
      </head>
      <body className=" text-white flex flex-col min-h-screen ">
        <Providers>
          <ToastContainer position="top-right" autoClose={1500} transition={Flip} />
          <Header />

          <main
            className="flex-1 p-5 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: bgImage }}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

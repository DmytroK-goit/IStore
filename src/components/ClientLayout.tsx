'use client';

import { usePathname } from 'next/navigation';
import { Providers } from '@/providers';
import { Header } from '@/components/header/header';
import { Flip, ToastContainer } from 'react-toastify';
import { Footer } from '@/components/footer/footer';
import { ThemeProvider } from 'next-themes';
import { CookiesModal } from '@/components/cookiesModal/cookiesModal';
import PushSubscribe from './PushSubscribe';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const bgImage =
    pathname === '/contactUs'
      ? "url('/img/BGcontactUs.webp')"
      : pathname === '/products'
        ? "url('/img/BGShop.webp')"
        : "url('/img/bg-store.webp')";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={true}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        closeOnClick
        pauseOnFocusLoss
        transition={Flip}
      />
      <Providers>
        <Header />
        <PushSubscribe />
        <main
          className="flex-1 p-5 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: bgImage }}
        >
          {children}
          <CookiesModal />
        </main>
        <Footer />
      </Providers>
    </ThemeProvider>
  );
};

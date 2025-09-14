import './globals.css';
import Link from 'next/link';
import { Providers } from '../providers';
import { Header } from '@/components/header/header';
import { Flip, ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white flex flex-col min-h-screen ">
        <Providers>
          <ToastContainer position="top-right" autoClose={3000} transition={Flip} />
          <Header />

          <main
            className="flex-1 p-5 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/bg-store.jpg')" }}
          >
            {children}
          </main>

          <footer className="flex flex-col items-center justify-center gap-2 h-20 bg-gray-800 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} MyShop. All rights reserved.
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

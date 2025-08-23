import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white flex flex-col min-h-screen ">
        <header className="flex justify-between items-center px-6 h-14 bg-gray-800 border-b border-gray-700">
          <h1 className="text-xl font-bold text-yellow-400">MyShop</h1>
          <nav className="flex gap-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/products" className="hover:underline">
              Shop
            </Link>
            <Link href="/cart" className="hover:underline">
              Cart
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </header>

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
      </body>
    </html>
  );
}

import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white flex flex-col min-h-screen align-center">
        <header className="flex bg-gray-300 gap-4 border-2 border-gray-400 h-10 justify-center align-center">
          <p>Header</p>
          <Link href="/" className="underline">
            Home
          </Link>
          <Link href="/cart">Cart</Link>
        </header>
        <main className="flex-1 justify-center items-center">{children}</main>
        <footer className="flex bg-gray-300 gap-4 border-2 border-gray-400 h-10 justify-center align-center">
          footer
        </footer>
      </body>
    </html>
  );
}

import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black-600 flex flex-col ">
        <header>
          <p>header</p>
          <Link href="/">Home</Link>
        </header>
        {children}
        <footer>footer</footer>
      </body>
    </html>
  );
}

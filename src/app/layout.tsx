export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black-600 flex flex-col ">
        <header>header</header>
        {children}
        <footer>footer</footer>
      </body>
    </html>
  );
}

import PushSubscribe from '@/components/PushSubscribe';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { Metadata } from 'next';
import { UpworkProvider } from '@/hooks/upWorkContext';

export const metadata: Metadata = {
  title: 'IStore – Your Tech Marketplace',
  description: 'Buy smartphones, laptops, accessories and electronics at IStore',

};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Goldman-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="text-white flex flex-col min-h-screen">
        <ClientLayout> <UpworkProvider>
          {children}
        </UpworkProvider></ClientLayout>
      </body>
    </html>
  );
}

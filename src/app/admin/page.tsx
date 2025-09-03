'use client';
import AddItem from '@/components/addItem/addItem';
import SoldItemsPage from '@/components/soldItem/soldItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContactUs } from '@/components/contactUs/contactUs';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link href="/" className="text-blue-500 underline">
          Go to Home
        </Link>
      </div>

      <AddItem />
      <ContactUs />
      <SoldItemsPage />
    </div>
  );
}

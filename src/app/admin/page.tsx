'use client';
import AddItem from '@/components/addItem/addItem';
import SoldItemsPage from '@/components/soldItem/soldItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContactUs } from '@/components/contactUs/contactUs';
import AdminListStore from '@/components/adminListStore/adminListStore';
import { Product } from '@/types/product';
import { useState } from 'react';

export default function AdminPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    console.log('Selected product:', product);
    setSelectedProduct(product);
  };
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link
          href="/admin/contactUs"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Contact Us Messages
        </Link>
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          View Orders
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex gap-12">
          <AddItem product={selectedProduct} />
          <AdminListStore onSelectProduct={handleSelectProduct} />
        </div>
      </div>
    </div>
  );
}

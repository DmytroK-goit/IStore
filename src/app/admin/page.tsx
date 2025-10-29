'use client';
import AddItem from '@/components/addItem/addItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminListStore from '@/components/adminListStore/adminListStore';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@/redux/UserAuth/selectors';
import { fetchUsers } from '@/redux/UserAuth/operations';
import { AppDispatch } from '@/redux/store';

export default function AdminPage() {
  const user = useSelector(selectUser);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-4">
          {' '}
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
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-12 sm:flex-row">
          <AddItem product={selectedProduct} />
          <AdminListStore onSelectProduct={handleSelectProduct} />
        </div>
      </div>
    </div>
  );
}

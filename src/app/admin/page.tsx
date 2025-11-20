'use client';
import AddItem from '@/components/addItem/addItem';
import AdminListStore from '@/components/adminListStore/adminListStore';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/redux/UserAuth/selectors';
import { fetchUsers } from '@/redux/UserAuth/operations';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const user = useSelector(selectUser);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'admin') router.push('/login');
  }, [user, router]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-12 lg:flex-row">
        <AddItem product={selectedProduct} />
        <AdminListStore onSelectProduct={setSelectedProduct} />
      </div>
    </div>
  );
}

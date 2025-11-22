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
import ProtectDemo from '@/components/ProtectDemo';
import ProtectAdminOrDemo from '@/components/ProtectAdminOrDemo';

function AdminDashboard() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dispatch = useDispatch<AppDispatch>();

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

export default ProtectAdminOrDemo(ProtectDemo(AdminDashboard));

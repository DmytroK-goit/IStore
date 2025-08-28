import AddItem from '@/components/addItem/addItem';
import SoldItemsPage from '@/components/soldItem/soldItem';

export default function AdminPage() {
  return (
    <div className="flex items-center">
      <AddItem />
      <SoldItemsPage />
    </div>
  );
}

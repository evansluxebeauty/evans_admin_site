import AdminOrders from '@/modules/AdminOrders';
import { Suspense } from 'react';

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrders />
    </Suspense>
  );
}

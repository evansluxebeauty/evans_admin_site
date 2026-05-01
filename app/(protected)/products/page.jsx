import AdminProducts from '@/modules/AdminProducts';
import { Suspense } from 'react';

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProducts />
    </Suspense>
  );
}

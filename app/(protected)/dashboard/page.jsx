import AdminDashboard from '@/modules/AdminDashboard';
import { Suspense } from 'react';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboard />
    </Suspense>
  );
}

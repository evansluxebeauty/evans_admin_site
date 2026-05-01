import AdminProfile from '@/modules/AdminProfile';
import { Suspense } from 'react';

export default function AdminProfilePage() {
  return (
    <Suspense fallback={null}>
      <AdminProfile />
    </Suspense>
  );
}

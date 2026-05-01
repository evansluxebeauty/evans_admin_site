import AdminLogin from '@/modules/AdminLogin';
import { Suspense } from 'react';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  );
}

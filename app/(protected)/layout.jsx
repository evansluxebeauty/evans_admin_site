import { Suspense } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function ProtectedAdminLayout({ children }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="w-10 h-10 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}

'use client';
import React from 'react';
import { NavLink } from '@/router-shim';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from '@/router-shim';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Products', icon: Package, path: '/products' },
    { name: 'Orders', icon: ShoppingBag, path: '/orders' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="hidden lg:flex w-64 bg-white h-screen fixed left-0 top-0 border-r border-beige-100 flex-col pt-8 pb-6 z-40">
      <div className="px-6 mb-10 flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-900 rounded-xl flex items-center justify-center text-gold-300 shadow-md">
          <Sparkles size={20} />
        </div>
        <h1 className="font-serif text-xl font-bold text-purple-900 leading-tight">Evans Luxe<br/>Protocol</h1>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm ${
                isActive
                  ? 'bg-purple-900 text-gold-300 shadow-lg'
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 font-semibold text-sm"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

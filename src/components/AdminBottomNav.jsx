'use client';
import React from 'react';
import { NavLink, useLocation, useNavigate, Link } from '@/router-shim';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Secure Session Disconnected');
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Items', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Sec', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-purple-50 px-2 sm:px-6 py-2 pb-safe z-50 rounded-t-3xl shadow-[0_-8px_30px_rgba(88,28,135,0.08)]">
      <nav className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="relative flex flex-col items-center p-2 min-w-[64px]"
            >
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-400 hover:text-purple-400 hover:bg-gray-50'
              }`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-bold transition-all duration-300 ${
                isActive ? 'text-purple-900 translate-y-0' : 'text-gray-400 translate-y-1'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        {/* Logout is separated */}
        <button
          onClick={handleLogout}
          className="relative flex flex-col items-center p-2 min-w-[64px]"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300">
            <LogOut size={20} strokeWidth={2} />
          </div>
          <span className="text-[10px] mt-1 font-bold text-gray-400 translate-y-1 transition-all duration-300">
            Exit
          </span>
        </button>
      </nav>
    </div>
  );
};

export default AdminBottomNav;

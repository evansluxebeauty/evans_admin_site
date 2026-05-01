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
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-beige-200 px-6 py-3 pb-8 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex flex-col items-center p-2 transition-colors duration-300 ${
                isActive ? 'text-purple-700' : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="admin-bottom-nav-indicator"
                  className="absolute -top-3 w-12 h-1 bg-purple-700 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        
        {/* Logout is separated */}
        <button
          onClick={handleLogout}
          className="relative flex flex-col items-center p-2 transition-colors duration-300 text-red-400 hover:text-red-500"
        >
          <LogOut size={24} strokeWidth={2} />
          <span className="text-[10px] mt-1 font-medium opacity-0 transition-opacity">
            Exit
          </span>
        </button>
      </nav>
    </div>
  );
};

export default AdminBottomNav;

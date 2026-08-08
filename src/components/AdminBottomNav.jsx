'use client';
import React from 'react';
import { useLocation, useNavigate, Link } from '@/router-shim';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
        className="pointer-events-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 32px rgba(62, 29, 74, 0.18), 0 2px 8px rgba(62, 29, 74, 0.1)',
          padding: '8px 12px',
        }}
      >
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'w-12 h-10 rounded-full' : 'w-10 h-10 rounded-full'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                    boxShadow: '0 4px 16px rgba(90,42,108,0.4)',
                  } : {}}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-glow"
                      className="absolute inset-0 rounded-full opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)',
                        filter: 'blur(6px)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-gold-300 relative z-10' : 'text-gray-400'}
                  />
                </motion.div>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[8px] font-bold uppercase tracking-widest text-purple-800 mt-0.5 whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* Separator line */}
          <div className="w-[1px] h-6 bg-purple-100/60 mx-1" />

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="relative flex flex-col items-center"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 min-h-0 min-w-0"
            >
              <LogOut size={18} strokeWidth={2} />
            </motion.div>
          </button>

        </nav>
      </motion.div>
    </div>
  );
};

export default AdminBottomNav;

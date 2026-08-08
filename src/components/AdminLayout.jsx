'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation, Link, useNavigate } from '@/router-shim';
import AdminBottomNav from './AdminBottomNav';
import { User, LogOut, LayoutDashboard, Package, ShoppingBag, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

/* ─────────────────────────────────────────
   MOBILE TOP NAV
───────────────────────────────────────── */
const AdminMobileTopNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-start px-4 transition-all duration-300`}
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(90,42,108,0.08)',
        boxShadow: scrolled ? '0 2px 20px rgba(62,29,74,0.10)' : 'none',
        padding: scrolled ? '8px 16px' : '12px 16px',
      }}
    >
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-9 h-9 overflow-hidden rounded-full flex-shrink-0 shadow-luxury"
          style={{ border: '2px solid rgba(212,175,55,0.35)' }}
        >
          <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex flex-col leading-none">
          <span className="font-serif text-lg font-bold tracking-tight text-purple-900">Evans Luxe</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] flex items-center gap-1"
            style={{ color: '#dc2626' }}>
            <Shield size={8} /> Admin Access
          </span>
        </div>
      </Link>
    </header>
  );
};

/* ─────────────────────────────────────────
   DESKTOP TOP NAV — Glassmorphism
───────────────────────────────────────── */
const AdminTopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Secure Session Disconnected');
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:flex fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(90,42,108,0.10)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(62,29,74,0.10)' : 'none',
        padding: scrolled ? '10px 0' : '18px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
        {/* Logo + Brand */}
        <Link to="/dashboard" className="flex items-center space-x-3 group whitespace-nowrap">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-10 h-10 overflow-hidden rounded-full shadow-luxury"
            style={{ border: '2px solid rgba(212,175,55,0.35)' }}
          >
            <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
              Evans Luxe
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] flex items-center gap-1"
              style={{ color: '#dc2626' }}>
              <Shield size={9} /> Admin Access
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path ||
              (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-2 font-semibold text-sm transition-colors pb-1.5 group min-h-[48px] ${
                  isActive ? 'text-purple-900' : 'text-gray-500 hover:text-purple-800'
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {link.name}
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #D4AF37, #edc757)' }}
                  initial={false}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all min-h-0 min-w-0"
            title="HQ Profile"
          >
            <motion.div whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <User size={18} strokeWidth={2} />
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all min-h-0 min-w-0"
          >
            <LogOut size={14} strokeWidth={2.5} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

/* ─────────────────────────────────────────
   ADMIN LAYOUT — Root wrapper
───────────────────────────────────────── */
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (token) {
        setIsAuthed(true);
      }
      setChecking(false);
    };
    checkAuth();
  }, [location.pathname, navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(160deg, #1a0a22, #3e1d4a)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gold-400 border-t-transparent animate-spin" />
          <p className="text-white/50 text-xs uppercase tracking-widest font-bold">Authenticating</p>
        </div>
      </div>
    );
  }

  const isLogin = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-beige-50 relative selection:bg-purple-200 selection:text-purple-900">
      <Toaster
        position={typeof window !== 'undefined' && window.innerWidth < 768 ? 'top-center' : 'top-right'}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
            color: '#fff',
            borderRadius: '16px',
            marginTop: '64px',
            boxShadow: '0 8px 32px rgba(62,29,74,0.3)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontWeight: '600',
            fontSize: '13px',
          },
        }}
      />

      {!isLogin && <AdminMobileTopNav />}
      {!isLogin && <AdminTopNav />}

      {/* Ambient background orbs */}
      {!isLogin && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="orb absolute w-[500px] h-[500px] bg-purple-100 top-[-8%] left-[-8%] opacity-40" />
          <div className="orb absolute w-[400px] h-[400px] bg-gold-100 top-[45%] right-[-6%] opacity-30"
            style={{ animationDelay: '4s' }} />
        </div>
      )}

      <main
        className={`flex-1 w-full max-w-7xl mx-auto relative px-4 md:px-12 ${
          !isLogin ? 'pt-20 md:pt-28 pb-28 md:pb-10' : ''
        }`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-purple-900 border-t-transparent animate-spin" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      {!isLogin && <AdminBottomNav />}
    </div>
  );
};

export default AdminLayout;

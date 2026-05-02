'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useLocation, Link, useNavigate } from '@/router-shim';
import AdminBottomNav from './AdminBottomNav';
import { User, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminTopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Inventory', path: '/products' },
    { name: 'Orders', path: '/orders' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Secure Session Disconnected');
    navigate('/');
  };

  return (
    <header 
      className={`hidden md:flex fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-md py-3' 
          : 'bg-white/60 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
        {/* Logo + Brand */}
        <Link to="/dashboard" className="flex items-center space-x-3 group whitespace-nowrap">
          <div className="w-10 h-10 overflow-hidden rounded-xl border border-purple-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
            <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
              Admin Lounge
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
              Admin Access
            </span>
          </div>
        </Link>
        
        {/* Main Links */}
        <nav className="flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/dashboard' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-bold text-base transition-colors pb-1 group ${
                  isActive ? 'text-purple-900' : 'text-gray-500 hover:text-purple-700'
                }`}
              >
                {link.name}
                {/* Active underline */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-700 rounded-full transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <User size={20} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-purple-700 transition-colors">
              HQ
            </span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors text-red-500">
              <LogOut size={16} strokeWidth={2} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

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
      <div className="flex items-center justify-center min-h-screen bg-beige-50">
        <div className="w-10 h-10 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-beige-50 relative selection:bg-purple-200 selection:text-purple-900">
      <Toaster 
        position={typeof window !== 'undefined' && window.innerWidth < 768 ? "top-center" : "top-right"} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#5A2A6C',
            color: '#fff',
            borderRadius: '16px',
            marginTop: '60px',
          },
        }} 
      />

      {/* Primary Navigation - Desktop */}
      {location.pathname !== '/login' && <AdminTopNav />}

      {/* Abstract Decorations to match storefront */}
      <div className="fixed top-[10%] left-[5%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10 animate-pulse"></div>
      <div className="fixed top-[40%] right-[10%] w-80 h-80 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>

      {/* Main Content Area */}
      <main className={`flex-1 w-full max-w-7xl mx-auto ${location.pathname !== '/login' ? 'md:pt-28 pb-24 md:pb-8' : ''} relative pt-10 px-6 md:px-12`}>
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          {children}
        </Suspense>
      </main>

      {/* Primary Navigation - Mobile Bottom */}
      {location.pathname !== '/login' && <AdminBottomNav />}
    </div>
  );
};

export default AdminLayout;

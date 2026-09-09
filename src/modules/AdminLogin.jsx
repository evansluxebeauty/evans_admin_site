'use client';
import API_BASE_URL from '@/config/api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';
import { useAuthStore } from '../store/useAuthStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        logout();
        localStorage.setItem('adminToken', data.token);
        toast.success('Admin Authenticated Successfully');
        window.location.href = '/dashboard';
      } else {
        toast.error(data.message || 'Invalid Credentials');
      }
    } catch (error) {
      toast.error('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0a22 0%, #2d0e3d 60%, #3e1d4a 100%)' }}>

      {/* Elegant Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb absolute w-[500px] h-[500px] bg-purple-600/10 top-[-10%] left-[-10%] opacity-40 blur-[100px]" />
        <div className="orb absolute w-[400px] h-[400px] bg-gold-400/5 bottom-[-8%] right-[-8%] opacity-30 blur-[90px]" style={{ animationDelay: '4s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gold-400/20 mb-4 shadow-luxury overflow-hidden"
            style={{ border: '2px solid rgba(212,175,55,0.3)' }}
          >
            <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-2xl font-serif text-white font-bold leading-none mb-2">Evans Luxe</h1>
          <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em] flex items-center justify-center gap-1.5">
            <Shield size={10} className="text-red-500 animate-pulse" /> Security Portal
          </p>
        </div>

        {/* Glass Dark Auth Container */}
        <div className="glass-dark p-6 rounded-[2.5rem] relative overflow-hidden">
          {/* Subtle gold line on top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block pl-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-white placeholder-white/30 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all shadow-inner"
                  placeholder="admin@evans.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest block pl-1">Master Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-11 text-xs font-semibold text-white placeholder-white/30 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all shadow-inner"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-gold-400 transition-colors min-h-0 min-w-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Premium Gold Login Trigger */}
            <motion.button
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6 relative overflow-hidden group min-h-0"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #edc757)',
                color: '#1a0a22',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
              }}
            >
              <div className="absolute inset-0 bg-white/30 group-hover:translate-x-full transition-transform duration-700 ease-in-out -translate-x-full skew-x-12" />
              {loading ? (
                <Loader2 className="animate-spin text-purple-950" size={16} />
              ) : (
                <>
                  <span>{loading ? 'Authenticating...' : 'Secure Access'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-950 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/30 mt-6 leading-relaxed">
          Unauthorized access is strictly monitored.<br />All sessions logged on HQ server.
        </p>

      </motion.div>
    </div>
  );
};

export default AdminLogin;

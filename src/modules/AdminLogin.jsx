'use client';
import API_BASE_URL from '@/config/api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';
import { useAuthStore } from '../store/useAuthStore';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        // Clear any existing user session before setting admin session
        logout();
        localStorage.setItem('adminToken', data.token);
        toast.success('Admin Authenticated Successfully');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Invalid Credentials');
      }
    } catch (error) {
      toast.error('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-beige-100 mb-6 shadow-sm overflow-hidden">
            <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-serif text-purple-900 mb-2 font-bold">Admin Portal</h1>
          <p className="text-gray-500 text-sm tracking-wide">Evans Luxe Beauty System Access</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-card border border-beige-100">
          <form onSubmit={handleLogin} className="space-y-6">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-beige-50 border border-beige-200 rounded-2xl py-3 pl-12 pr-4 text-purple-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700/50 focus:border-transparent transition-all"
                  placeholder="admin@evans.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Master Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-beige-50 border border-beige-200 rounded-2xl py-3 pl-12 pr-4 text-purple-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-purple-900 hover:bg-purple-800 text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span>{loading ? 'Authenticating...' : 'Secure Login'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Unauthorized access is strictly prohibited.<br />All actions are logged securely.
        </p>

      </motion.div>
    </div>
  );
};

export default AdminLogin;

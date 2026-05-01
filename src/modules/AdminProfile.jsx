'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Save, Lock, Eye, EyeOff, Fingerprint, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@evans.com';
    setFormData(prev => ({ ...prev, email: adminEmail }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Session Terminated');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Sequence Mismatch');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password || undefined
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Identity Verified & Updated');
        localStorage.setItem('adminEmail', data.email);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error) {
      toast.error('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-purple-900 mb-2">Identity Profile</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Master Credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Master Identity Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white rounded-[3.5rem] p-10 shadow-luxury border border-beige-100 flex flex-col items-center text-center overflow-hidden relative group"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-purple-900" />
          <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center text-purple-900 shadow-inner mb-6 relative">
            <Shield size={40} strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                <Shield size={12} className="text-white" />
            </div>
          </div>
          
          <h2 className="font-serif text-2xl font-bold text-purple-900 mb-1">Evans Master</h2>
          <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-8">Access Level 01</p>
          
          <div className="w-full space-y-3 mb-8">
             <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-gray-400 uppercase">
                <Fingerprint size={12} />
                <span>Biometrics Active</span>
             </div>
             <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-green-600 uppercase">
                <Lock size={12} />
                <span>RSA Encrypted</span>
             </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full py-4 border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
          >
            <LogOut size={14} />
            <span>Terminate Session</span>
          </button>
        </motion.div>

        {/* Security Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-luxury border border-beige-100"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <Mail size={16} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">System Identifier</h3>
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3 px-1">Master Email</label>
                    <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-beige-50 border border-transparent focus:border-purple-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:bg-white transition-all font-semibold outline-none"
                    />
                </div>
            </div>

            <div className="h-px bg-beige-50" />

            <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <Key size={16} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Credential Sequence</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3 px-1">Update Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-beige-50 border border-transparent focus:border-purple-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:bg-white transition-all font-semibold pr-14 outline-none"
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 bottom-5 text-gray-400 hover:text-purple-900 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3 px-1">Verify Password</label>
                        <input 
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="w-full bg-beige-50 border border-transparent focus:border-purple-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:bg-white transition-all font-semibold outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-900 text-gold-300 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-luxury hover:bg-purple-800 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-gold-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Save size={18} />
                            <span>Update Profile</span>
                        </>
                    )}
                </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;

'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Save, Lock, Eye, EyeOff, LogOut, Settings, X, Truck, ChevronRight, User, Package, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [settingsData, setSettingsData] = useState({
    shippingFee: 150,
    freeShippingThreshold: 2000,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@evans.com';
    setFormData((prev) => ({ ...prev, email: adminEmail }));
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await res.json();
      if (res.ok && data) {
        setSettingsData({
          shippingFee: data.shippingFee || 150,
          freeShippingThreshold: data.freeShippingThreshold || 2000,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });
      if (res.ok) {
        toast.success('Store settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Update failed — check connection');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData.email, undefined);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    await updateProfile(undefined, formData.password);
  };

  const updateProfile = async (email, password) => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const payload = {};
      if (email) payload.email = email;
      if (password) payload.password = password;

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(password ? 'Password updated successfully' : 'Email updated successfully');
        if (email) localStorage.setItem('adminEmail', data.email);
        if (password) {
          setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        }
      } else {
         toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed — check connection');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Session Terminated');
    navigate('/login');
  };

  const passwordsMatch = formData.password.length > 0 && formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const passwordMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  const inputClass = "w-full bg-white border border-gray-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 rounded-xl px-4 py-3.5 text-sm font-medium outline-none transition-all placeholder-gray-400 shadow-sm";
  const labelClass = "text-[12px] font-bold uppercase tracking-widest text-gray-500 mb-2 block";

  const MenuItem = ({ icon, title, subtitle, onClick, hideChevron = false, isDestructive = false }) => (
    <div 
      onClick={onClick} 
      className={`group flex items-center justify-between p-5 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer border-b border-gray-100 last:border-b-0 ${isDestructive ? 'hover:bg-red-50/50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'}`}>
          {icon}
        </div>
        <div>
          <h4 className={`text-sm font-bold ${isDestructive ? 'text-red-600' : 'text-gray-900'}`}>{title}</h4>
          {subtitle && <p className="text-[12px] text-gray-500 mt-1 font-medium">{subtitle}</p>}
        </div>
      </div>
      {!hideChevron && <ChevronRight size={20} className="text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />}
    </div>
  );

  return (
    <div className="bg-[#F8F9FA] min-h-[100dvh] flex flex-col pb-16 font-sans">
      
      {/* ── Premium Header ── */}
      <div className="bg-white pt-12 pb-10 px-6 sm:px-8 shadow-sm relative border-b border-gray-200 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Shield size={36} className="text-white transform -rotate-3" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Evans Luxe Portal</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">{formData.email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
              <span className="text-[10px] text-purple-700 uppercase tracking-widest font-bold">System Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Menu Container ── */}
      <div className="max-w-3xl w-full mx-auto px-4 mt-8 relative z-20 flex-1 flex flex-col">
        
        <div className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">Store Management</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <MenuItem 
              icon={<ShoppingBag size={22} strokeWidth={1.5} />} 
              title="Orders & Fulfillment" 
              subtitle="View, track and fulfill customer orders" 
              onClick={() => navigate('/orders')} 
            />
            <MenuItem 
              icon={<Package size={22} strokeWidth={1.5} />} 
              title="Inventory Management" 
              subtitle="Add, edit or remove store products" 
              onClick={() => navigate('/products')} 
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">System Preferences</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <MenuItem 
              icon={<Settings size={22} strokeWidth={1.5} />} 
              title="Configuration Settings" 
              subtitle="Manage shipping rules, email, and security" 
              onClick={() => setIsSettingsModalOpen(true)} 
            />
            <MenuItem 
              icon={<LogOut size={22} strokeWidth={1.5} />} 
              title="Terminate Session" 
              hideChevron 
              isDestructive 
              onClick={handleLogout} 
            />
          </div>
        </div>
        
        <p className="text-center text-[11px] text-gray-400 font-medium mt-auto py-8">
          Evans Luxe Enterprise System • Version 1.0.0
        </p>
      </div>

      {/* ═══════════════════════════════════════
          PREMIUM SLIDING PANEL SETTINGS
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-full md:w-[480px] z-[70] bg-[#F8F9FA] shadow-2xl flex flex-col border-l border-gray-200"
            >
              {/* Panel Header */}
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between shadow-sm shrink-0">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Settings</h2>
                  <p className="text-[12px] text-gray-500 font-medium mt-1">Manage system configurations</p>
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors border border-gray-200 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Panel Scrollable Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                
                {/* 1. SHIPPING SETTINGS */}
                <section>
                   <div className="flex items-center gap-3 mb-4 px-1">
                     <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                       <Truck size={16} strokeWidth={2.5} />
                     </div>
                     <h3 className="font-bold text-gray-900">Shipping Rules</h3>
                   </div>
                   
                   <form onSubmit={handleSettingsSubmit} className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 space-y-5">
                     <div>
                       <label className={labelClass}>Standard Shipping Fee (₹)</label>
                       <input
                         type="number"
                         required
                         min="0"
                         value={settingsData.shippingFee}
                         onChange={(e) => setSettingsData({ ...settingsData, shippingFee: Number(e.target.value) })}
                         className={inputClass}
                       />
                     </div>
                     <div>
                       <label className={labelClass}>Free Shipping Threshold (₹)</label>
                       <input
                         type="number"
                         required
                         min="0"
                         value={settingsData.freeShippingThreshold}
                         onChange={(e) => setSettingsData({ ...settingsData, freeShippingThreshold: Number(e.target.value) })}
                         className={inputClass}
                       />
                       <p className="text-[11px] text-gray-500 mt-2 font-medium px-1 flex items-center gap-1.5">
                         <Shield size={12} className="text-green-500"/>
                         Orders above this amount get free shipping.
                       </p>
                     </div>
                     <div className="pt-2">
                       <button
                         type="submit"
                         disabled={settingsLoading}
                         className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {settingsLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Save size={18} /> <span>Save Shipping Rules</span> </>}
                       </button>
                     </div>
                   </form>
                </section>

                {/* 2. EMAIL SETTINGS */}
                <section>
                   <div className="flex items-center gap-3 mb-4 px-1">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                       <Mail size={16} strokeWidth={2.5} />
                     </div>
                     <h3 className="font-bold text-gray-900">Administrator Email</h3>
                   </div>
                   
                   <form onSubmit={handleEmailSubmit} className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 space-y-5">
                     <div>
                       <label className={labelClass}>Contact Email</label>
                       <input
                         type="email"
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         className={inputClass}
                       />
                     </div>
                     <div className="pt-2">
                       <button
                         type="submit"
                         disabled={loading}
                         className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Save size={18} /> <span>Update Email</span> </>}
                       </button>
                     </div>
                   </form>
                </section>

                {/* 3. PASSWORD SETTINGS */}
                <section>
                   <div className="flex items-center gap-3 mb-4 px-1">
                     <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                       <Key size={16} strokeWidth={2.5} />
                     </div>
                     <h3 className="font-bold text-gray-900">Security Credentials</h3>
                   </div>

                   <form onSubmit={handlePasswordSubmit} className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-200 space-y-5">
                     <div>
                       <label className={labelClass}>New Password</label>
                       <div className="relative">
                         <input
                           type={showNewPassword ? 'text' : 'password'}
                           value={formData.password}
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           className={`${inputClass} pr-12`}
                           placeholder="••••••••"
                         />
                         <button
                           type="button"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                         >
                           {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                       </div>
                     </div>

                     <div>
                       <label className={labelClass}>Confirm Password</label>
                       <div className="relative">
                         <input
                           type={showConfirmPassword ? 'text' : 'password'}
                           value={formData.confirmPassword}
                           onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                           className={`${inputClass} pr-12 ${passwordMismatch ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                           placeholder="••••••••"
                         />
                         <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                         >
                           {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                       </div>
                       {passwordMismatch && (
                         <p className="text-red-500 text-[11px] font-bold mt-2 px-1">Passwords do not match.</p>
                       )}
                     </div>

                     <div className="pt-2">
                       <button
                         type="submit"
                         disabled={loading || passwordMismatch || !formData.password}
                         className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                         {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Lock size={18} /> <span>Update Password</span> </>}
                       </button>
                     </div>
                   </form>
                </section>
                
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;

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

  const inputClass = "w-full bg-gray-50 border border-gray-200 focus:border-purple-500 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:bg-white transition-all placeholder-gray-400";
  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block";

  const MenuItem = ({ icon, title, subtitle, onClick, hideChevron = false, isDestructive = false }) => (
    <div 
      onClick={onClick} 
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'}`}>
          {icon}
        </div>
        <div>
          <h4 className={`text-sm font-bold ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{title}</h4>
          {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {!hideChevron && <ChevronRight size={18} className="text-gray-400" />}
    </div>
  );

  return (
    <div className="bg-gray-100 h-[100dvh] overflow-hidden flex flex-col pb-16">
      
      {/* ── Flipkart / Meesho Style Header ── */}
      <div className="bg-purple-900 pt-8 pb-10 px-6 sm:px-8 flex items-center gap-5 shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-xl pointer-events-none" />
        
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-inner backdrop-blur-sm z-10">
          <Shield size={36} className="text-white drop-shadow-md" />
        </div>
        <div className="z-10">
          <h1 className="text-2xl font-bold text-white tracking-wide">Evans Luxe</h1>
          <p className="text-purple-200 text-sm mt-1 opacity-90">{formData.email}</p>
          <div className="mt-2 inline-block bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/20 text-[10px] text-white uppercase tracking-widest font-bold">
            Super Admin
          </div>
        </div>
      </div>

      {/* ── Main Menu Container ── */}
      <div className="max-w-3xl mx-auto px-4 -mt-4 relative z-20 flex-1 overflow-hidden flex flex-col">
        
        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <MenuItem 
            icon={<ShoppingBag size={20} />} 
            title="Manage Orders" 
            subtitle="View, track and fulfill customer orders" 
            onClick={() => navigate('/orders')} 
          />
          <MenuItem 
            icon={<Package size={20} />} 
            title="Manage Products" 
            subtitle="Add, edit or remove store inventory" 
            onClick={() => navigate('/products')} 
          />
        </div>

        {/* Settings & Account Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <MenuItem 
            icon={<Settings size={20} />} 
            title="Account & Store Settings" 
            subtitle="Shipping fees, Email, Password" 
            onClick={() => setIsSettingsModalOpen(true)} 
          />
          <MenuItem 
            icon={<LogOut size={20} />} 
            title="Sign Out" 
            hideChevron 
            isDestructive 
            onClick={handleLogout} 
          />
        </div>
        
        <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-8">
          Evans Luxe Admin Portal • v1.0
        </p>

      </div>

      {/* ═══════════════════════════════════════
          SETTINGS MODAL (Shipping, Email, Password)
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-50 rounded-2xl w-full max-w-md shadow-2xl relative my-auto max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-white p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                    <Settings size={16} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                </div>
                <button
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-5 overflow-y-auto space-y-6">
                
                {/* 1. SHIPPING SETTINGS */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                     <Truck size={18} className="text-green-600" />
                     <h3 className="font-bold text-gray-900 text-sm">Store Shipping Rules</h3>
                   </div>
                   
                   <form onSubmit={handleSettingsSubmit} className="space-y-4">
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
                       <p className="text-[10px] text-gray-400 mt-1 font-medium px-1">Orders above this amount get free shipping.</p>
                     </div>
                     <button
                       type="submit"
                       disabled={settingsLoading}
                       className="w-full bg-green-600 text-white py-3 rounded-lg font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       {settingsLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Save size={15} /> <span>Save Shipping</span> </>}
                     </button>
                   </form>
                </div>

                {/* 2. EMAIL SETTINGS */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                     <Mail size={18} className="text-blue-600" />
                     <h3 className="font-bold text-gray-900 text-sm">Update Login Email</h3>
                   </div>
                   
                   <form onSubmit={handleEmailSubmit} className="space-y-4">
                     <div>
                       <label className={labelClass}>Admin Email</label>
                       <input
                         type="email"
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         className={inputClass}
                       />
                     </div>
                     <button
                       type="submit"
                       disabled={loading}
                       className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Save size={15} /> <span>Save Email</span> </>}
                     </button>
                   </form>
                </div>

                {/* 3. PASSWORD SETTINGS */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                     <Key size={18} className="text-red-600" />
                     <h3 className="font-bold text-gray-900 text-sm">Security & Password</h3>
                   </div>

                   <form onSubmit={handlePasswordSubmit} className="space-y-4">
                     <div>
                       <label className={labelClass}>New Password</label>
                       <div className="relative">
                         <input
                           type={showNewPassword ? 'text' : 'password'}
                           value={formData.password}
                           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                           className={`${inputClass} pr-10`}
                           placeholder="••••••••"
                         />
                         <button
                           type="button"
                           onClick={() => setShowNewPassword(!showNewPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700 p-1"
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
                           className={`${inputClass} pr-10 ${passwordMismatch ? 'border-red-300 bg-red-50/20' : ''}`}
                           placeholder="••••••••"
                         />
                         <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700 p-1"
                         >
                           {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                       </div>
                     </div>

                     <button
                       type="submit"
                       disabled={loading || passwordMismatch || !formData.password}
                       className="w-full bg-red-600 text-white py-3 rounded-lg font-bold uppercase tracking-[0.15em] text-[11px] shadow-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <> <Lock size={15} /> <span>Update Password</span> </>}
                     </button>
                   </form>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;

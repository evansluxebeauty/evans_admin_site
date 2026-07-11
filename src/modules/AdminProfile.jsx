'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Save, LogOut, Settings, Truck, User, Package, ShoppingBag, LayoutDashboard, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
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
  const [activeTab, setActiveTab] = useState('general');

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

  const inputClass = "w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 text-sm text-gray-900 outline-none transition-all placeholder-gray-400";
  const labelClass = "text-sm font-medium text-gray-700 mb-1.5 block";
  
  const btnClass = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* ── Standard Top Navigation ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">Evans Luxe Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline-block">{formData.email}</span>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline-block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="space-y-1">
              <a onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Settings size={18} className={activeTab === 'general' ? 'text-blue-700' : 'text-gray-400'} />
                General Settings
              </a>
              <a onClick={() => setActiveTab('security')} className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Key size={18} className={activeTab === 'security' ? 'text-blue-700' : 'text-gray-400'} />
                Security
              </a>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Management</p>
                <a onClick={() => navigate('/orders')} className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-gray-400" />
                    Orders
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </a>
                <a onClick={() => navigate('/products')} className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-gray-400" />
                    Products
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </a>
              </div>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 max-w-3xl">
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                
                {/* Store Preferences */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                      <Truck size={18} className="text-gray-500" />
                      Shipping Rules
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Configure global shipping fees and free delivery thresholds.</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-md">
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
                        <p className="mt-1.5 text-xs text-gray-500">Orders exceeding this amount qualify for free shipping.</p>
                      </div>
                      <div className="pt-2">
                        <button type="submit" disabled={settingsLoading} className={btnClass}>
                          {settingsLoading ? 'Saving...' : 'Save Preferences'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                      <Mail size={18} className="text-gray-500" />
                      Administrator Email
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Update the primary email address used for admin login.</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label className={labelClass}>Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div className="pt-2">
                        <button type="submit" disabled={loading} className={btnClass}>
                          {loading ? 'Updating...' : 'Update Email'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                      <Lock size={18} className="text-gray-500" />
                      Change Password
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label className={labelClass}>New Password</label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className={`${inputClass} ${passwordMismatch ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {passwordMismatch && (
                          <p className="mt-1.5 text-xs text-red-600">Passwords do not match.</p>
                        )}
                      </div>
                      <div className="pt-2">
                        <button type="submit" disabled={loading || passwordMismatch || !formData.password} className={btnClass}>
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

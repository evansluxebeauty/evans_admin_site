'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Save, LogOut, Settings, Truck, User, Package, ShoppingBag, ChevronRight, ChevronDown, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [settingsData, setSettingsData] = useState({
    shippingFee: 150,
    freeShippingThreshold: 2000,
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Accordion states
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [isEmailOpen, setIsEmailOpen] = useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = useState(true);

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@evansluxe.com';
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
    await updateProfile(formData.email, undefined, undefined);
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
    await updateProfile(undefined, formData.password, formData.currentPassword);
  };

  const updateProfile = async (email, password, currentPassword) => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const payload = {};
      if (email) payload.email = email;
      if (password) payload.password = password;
      if (currentPassword) payload.currentPassword = currentPassword;

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
          setFormData((prev) => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
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
    window.location.href = '/login';
  };

  const passwordMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;

  const inputClass = "w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md px-3 py-2 text-sm text-gray-900 outline-none transition-all placeholder-gray-400";
  const labelClass = "text-sm font-medium text-gray-700 mb-1.5 block";
  const btnClass = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Account & Security</h1>
              <p className="text-sm text-gray-500">Manage security settings, admin credentials, and store configuration.</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <LogOut size={16} className="shrink-0" />
            <span className="whitespace-nowrap">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'general' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={18} className={activeTab === 'general' ? 'text-blue-700' : 'text-gray-400'} />
              Store Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'security' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Key size={18} className={activeTab === 'security' ? 'text-blue-700' : 'text-gray-400'} />
              Security & Credentials
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            
            {activeTab === 'general' && (
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                  className="w-full px-4 py-5 sm:px-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                      <Truck size={18} className="text-gray-500" />
                      Shipping & Delivery Rules
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Configure standard shipping charges and free shipping threshold.</p>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${isShippingOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isShippingOpen && (
                  <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
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
                      </div>
                      <div className="pt-2">
                        <button type="submit" disabled={settingsLoading} className={btnClass}>
                          <Save size={16} />
                          {settingsLoading ? 'Saving...' : 'Save Settings'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* Admin Email Update */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setIsEmailOpen(!isEmailOpen)}
                    className="w-full px-4 py-5 sm:px-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                        <Mail size={18} className="text-gray-500" />
                        Admin Email Address
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">Update the primary master email address for admin login and alerts.</p>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${isEmailOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isEmailOpen && (
                    <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                      <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md">
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
                        <div className="pt-2">
                          <button type="submit" disabled={loading} className={btnClass}>
                            {loading ? 'Updating...' : 'Update Email'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Password Change */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                    className="w-full px-4 py-5 sm:px-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <h3 className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-2">
                        <Lock size={18} className="text-gray-500" />
                        Change Master Admin Password
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">Update your master admin password to secure dashboard access.</p>
                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform duration-200 ${isPasswordOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isPasswordOpen && (
                    <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                      <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                        <div>
                          <label className={labelClass}>Current Password (Optional)</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              required
                              placeholder="Min 6 characters"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Confirm New Password</label>
                          <input
                            type="password"
                            required
                            placeholder="Re-enter new password"
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
                  )}
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

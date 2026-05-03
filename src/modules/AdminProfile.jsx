'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, Save, Lock, Eye, EyeOff, Fingerprint, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from '@/router-shim';

const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@evans.com';
    setFormData((prev) => ({ ...prev, email: adminEmail }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Session Terminated');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully');
        localStorage.setItem('adminEmail', data.email);
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      toast.error('Update failed — check connection');
    } finally {
      setLoading(false);
    }
  };

  /* ── password match helper ── */
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const inputClass =
    'w-full bg-beige-50 border border-transparent focus:border-purple-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:bg-white transition-all placeholder-gray-300';
  const labelClass =
    'text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2 block px-1';

  return (
    <div className="pb-8 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-900 mb-1">
          Admin Profile
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Manage your credentials
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══════════════════════════════════════
            LEFT — Identity Card
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1 bg-white rounded-[2.5rem] p-7 sm:p-9 shadow-luxury border border-beige-100 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-700 via-purple-500 to-gold-400" />

          {/* avatar shield */}
          <div className="w-20 h-20 bg-purple-50 rounded-[1.8rem] flex items-center justify-center text-purple-900 shadow-inner mb-5 mt-2 relative">
            <Shield size={36} strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-[3px] border-white rounded-full flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-purple-900 mb-0.5">
            Evans Admin
          </h2>
          <p className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-6">
            Super Admin
          </p>

          {/* status indicators */}
          <div className="w-full bg-beige-50 rounded-2xl p-4 space-y-3 mb-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              <Fingerprint size={13} className="text-purple-400" />
              <span>Session Active</span>
              <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              <Lock size={13} className="text-purple-400" />
              <span>Encrypted Connection</span>
              <span className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>

          {/* logout button */}
          <button
            onClick={handleLogout}
            className="w-full py-3.5 border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 group"
          >
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* ═══════════════════════════════════════
            RIGHT — Credential Form
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-[2.5rem] p-7 sm:p-9 shadow-luxury border border-beige-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Email Section ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={17} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    Email Address
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Your login identifier
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Admin Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass}
                  placeholder="admin@evans.com"
                />
              </div>
            </div>

            {/* divider */}
            <div className="h-px bg-beige-100" />

            {/* ── Password Section ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Key size={17} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    Change Password
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Leave blank to keep current password
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* New Password */}
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`${inputClass} pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="!min-h-0 !min-w-0 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700 transition-colors p-1"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`${inputClass} pr-12 ${
                        passwordMismatch
                          ? 'border-red-300 focus:border-red-400 bg-red-50/40'
                          : passwordsMatch
                          ? 'border-green-300 focus:border-green-400 bg-green-50/40'
                          : ''
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="!min-h-0 !min-w-0 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-700 transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {/* Match / mismatch indicator */}
                  {passwordMismatch && (
                    <div className="flex items-center gap-1 mt-2 px-1">
                      <AlertCircle size={12} className="text-red-500" />
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                        Passwords don't match
                      </span>
                    </div>
                  )}
                  {passwordsMatch && (
                    <div className="flex items-center gap-1 mt-2 px-1">
                      <CheckCircle size={12} className="text-green-600" />
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                        Passwords match
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || passwordMismatch}
                className="w-full bg-purple-900 text-white py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-luxury hover:bg-purple-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={17} />
                    <span>Save Changes</span>
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

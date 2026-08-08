'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Package, TrendingUp, ArrowUpRight, Sparkles, Clock, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link } from '@/router-shim';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeItems: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [pRes, oRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products/admin`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/orders/admin`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const products = await pRes.json();
      const ordersData = await oRes.json();

      if (pRes.ok && oRes.ok) {
        setStats({
          totalProducts: products.length,
          totalOrders: ordersData.total || ordersData.orders?.length || 0,
          totalRevenue: ordersData.orders?.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0,
          activeItems: products.filter(p => p.isActive).length,
          outOfStock: products.filter(p => p.stock === 0).length,
          lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length
        });
      } else if (pRes.status === 401 || oRes.status === 401) {
        console.warn('Backend authentication failed (expected in bypass mode)');
      } else {
        toast.error(products.message || ordersData.message || 'Failed to load data');
      }
    } catch (error) {
      toast.error('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100/50' },
    { name: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-gold-600', bg: 'bg-gold-100/50' },
    { name: 'Catalog', value: stats.totalProducts, icon: Package, color: 'text-green-600', bg: 'bg-green-100/50' },
    { name: 'Active', value: stats.activeItems, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100/50' },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-purple-900" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">Syncing database</p>
      </div>
    );
  }

  return (
    <div className="pb-10 px-2 sm:px-4">
      {/* Title */}
      <div className="mb-8 md:mb-12">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 mb-1.5">Boutique Insights</h1>
        <div className="flex items-center space-x-1.5 text-gray-400 font-medium">
          <Clock size={12} />
          <span className="text-[9px] sm:text-xs uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-2xl md:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-purple-50 flex flex-col items-center text-center group transition-all hover:shadow-md"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform duration-300`}>
              <stat.icon className={stat.color} size={16} />
            </div>
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{stat.name}</p>
            <h3 className="font-numbers text-sm sm:text-base md:text-lg font-black text-purple-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Stock Alerts Row */}
      {(stats.outOfStock > 0 || stats.lowStock > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-12"
        >
          {stats.outOfStock > 0 && (
            <Link
              to="/products"
              className="flex-1 flex items-center space-x-3 bg-red-50 border border-red-100 rounded-xl md:rounded-2xl px-4 py-3.5 hover:bg-red-100 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <XCircle size={14} className="text-red-600" />
              </div>
              <div className="leading-tight">
                <p className="text-[8px] font-bold uppercase tracking-wider text-red-600 mb-0.5">Out of Stock</p>
                <p className="font-numbers font-bold text-red-800 text-xs sm:text-sm">{stats.outOfStock} <span className="font-sans text-[10px] font-medium text-red-600">Product{stats.outOfStock !== 1 ? 's' : ''}</span></p>
              </div>
              <ArrowUpRight size={14} className="text-red-400 ml-auto" />
            </Link>
          )}
          {stats.lowStock > 0 && (
            <Link
              to="/products"
              className="flex-1 flex items-center space-x-3 bg-amber-50 border border-amber-100 rounded-xl md:rounded-2xl px-4 py-3.5 hover:bg-amber-100 transition-all group"
            >
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle size={14} className="text-amber-600" />
              </div>
              <div className="leading-tight">
                <p className="text-[8px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">Low Stock</p>
                <p className="font-numbers font-bold text-amber-800 text-xs sm:text-sm">{stats.lowStock} <span className="font-sans text-[10px] font-medium text-amber-600">Product{stats.lowStock !== 1 ? 's' : ''} &lt; 10</span></p>
              </div>
              <ArrowUpRight size={14} className="text-amber-400 ml-auto" />
            </Link>
          )}
        </motion.div>
      )}

      {/* Dashboard Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Banner Card */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #3e1d4a 0%, #5A2A6C 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-1000" />
          <Sparkles className="text-gold-300 mb-4" size={20} />
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2 md:mb-3">Botanical Ecosystem</h2>
          <p className="text-purple-100/80 text-xs md:text-sm leading-relaxed mb-6 font-medium">The Evans Luxe ecosystem is performing at optimal efficiency. All botanical extracts are synced and ready for distribution.</p>
          <Link 
            to="/products"
            className="inline-flex bg-gold-400 text-purple-950 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow hover:bg-gold-300 active:scale-95 transition-all min-h-0"
          >
            Manage Inventory
          </Link>
        </motion.div>

        {/* Health Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-beige-100/60"
        >
          <h2 className="font-serif text-lg md:text-xl font-bold text-purple-900 mb-6">Ecosystem Health</h2>
          <div className="space-y-4">
            {[
              { label: 'Inventory Database', status: 'Healthy' },
              { label: 'Cloudinary Assets', status: 'Synced' },
              { label: 'Order Processing', status: 'Active' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center pb-3 border-b border-beige-50 last:border-0 last:pb-0">
                <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-[8px] sm:text-[9px] font-black text-purple-900 bg-purple-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{item.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

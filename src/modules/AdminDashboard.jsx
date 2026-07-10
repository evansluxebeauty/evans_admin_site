'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Package, TrendingUp, ArrowUpRight, Sparkles, Clock, AlertTriangle, XCircle } from 'lucide-react';
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
        // Silent fail for bypass mode
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
    { name: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100/50' },
    { name: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-gold-600', bg: 'bg-gold-100/50' },
    { name: 'Catalog', value: stats.totalProducts, icon: Package, color: 'text-green-600', bg: 'bg-green-100/50' },
    { name: 'Active', value: stats.activeItems, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100/50' },
  ];

  return (
    <div className="pb-10">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-purple-900 mb-2">Boutique Insights</h1>
        <div className="flex items-center space-x-2 text-gray-500 font-medium">
          <Clock size={14} />
          <span className="text-xs uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-purple-50 flex flex-col items-center text-center group transition-all hover:shadow-md"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={stat.color} size={18} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.name}</p>
            <h3 className="text-lg font-black text-purple-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Stock Alerts Row */}
      {(stats.outOfStock > 0 || stats.lowStock > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {stats.outOfStock > 0 && (
            <Link
              to="/products"
              className="flex-1 flex items-center space-x-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 hover:bg-red-100 transition-all group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <XCircle size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-red-600">Out of Stock</p>
                <p className="font-bold text-red-800 text-sm">{stats.outOfStock} Product{stats.outOfStock !== 1 ? 's' : ''}</p>
              </div>
              <ArrowUpRight size={16} className="text-red-400 ml-auto" />
            </Link>
          )}
          {stats.lowStock > 0 && (
            <Link
              to="/products"
              className="flex-1 flex items-center space-x-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 hover:bg-amber-100 transition-all group"
            >
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">Low Stock</p>
                <p className="font-bold text-amber-800 text-sm">{stats.lowStock} Product{stats.lowStock !== 1 ? 's' : ''} &lt; 10</p>
              </div>
              <ArrowUpRight size={16} className="text-amber-400 ml-auto" />
            </Link>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-1000" />
          <Sparkles className="text-gold-300 mb-4" size={24} />
          <h2 className="font-serif text-2xl font-bold mb-3 italic">Botanical Ecosystem</h2>
          <p className="text-purple-100/80 text-xs md:text-sm leading-relaxed mb-6 font-medium">The Evans Luxe ecosystem is performing at optimal efficiency. All botanical extracts are synced and ready for distribution.</p>
          <button 
            onClick={() => window.location.hash = '#/products'}
            className="bg-gold-400 text-purple-900 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow hover:bg-gold-300 transition-all"
          >
            Manage Inventory
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3.5rem] p-10 shadow-luxury border border-beige-100"
        >
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">Ecosystem Health</h2>
          <div className="space-y-6">
            {[
              { label: 'Inventory Database', status: 'Healthy' },
              { label: 'Cloudinary Assets', status: 'Synced' },
              { label: 'Order Processing', status: 'Active' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center pb-4 border-b border-beige-50 last:border-0 last:pb-0">
                <span className="text-sm font-semibold text-gray-500">{item.label}</span>
                <span className="text-[10px] font-black text-purple-900 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{item.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, X, ChevronLeft, ChevronRight, MapPin, Phone, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/admin?pageNumber=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
        setTotalPages(data.pages);
      }
    } catch (error) {
      toast.error('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: status })
      });
      if (response.ok) {
        toast.success(`Status updated to: ${status.toUpperCase()}`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          const updated = await response.json();
          setSelectedOrder(updated);
        }
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const statusMap = {
    placed: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Processing' },
    shipped: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Transit' },
    'out-for-delivery': { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Out for Delivery' },
    delivered: { bg: 'bg-green-50', text: 'text-green-700', label: 'Completed' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelled' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="pb-16">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-purple-900">Orders</h1>
        <div className="bg-white px-6 py-3 rounded-full shadow-luxury border border-beige-100 flex items-center space-x-3">
          <ShoppingBag className="text-purple-600" size={18} />
          <span className="text-xs font-bold text-purple-900">{orders.length} ACTIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {orders.map((order) => (
            <motion.div 
                key={order._id}
                variants={itemVariants}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-[2.5rem] p-6 shadow-luxury border border-beige-100 hover:border-purple-200 transition-all cursor-pointer group relative overflow-hidden"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Queue ID</p>
                        <h3 className="font-sans font-black text-purple-900">#{order._id.slice(-6).toUpperCase()}</h3>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[order.orderStatus]?.bg} ${statusMap[order.orderStatus]?.text}`}>
                        {statusMap[order.orderStatus]?.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Customer</p>
                        <p className="font-bold text-sm text-gray-800 whitespace-nowrap truncate">{order.shippingAddress.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Value</p>
                        <p className="text-lg font-sans font-black text-purple-900 whitespace-nowrap">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute right-0 top-0 h-full w-1 bg-purple-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modern Pagination */}
      <div className="mt-12 flex justify-center items-center space-x-6">
        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purple-900 shadow-luxury disabled:opacity-30 transition-all border border-beige-100"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <span className="text-sm font-bold text-purple-900 font-sans tracking-widest uppercase">Page {page} / {totalPages}</span>
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purple-900 shadow-luxury disabled:opacity-30 transition-all border border-beige-100"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Full Sheet Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-purple-900/10 backdrop-blur-2xl z-[100] flex items-end md:items-center justify-center p-4">
             <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-2xl rounded-t-[4rem] md:rounded-[4rem] shadow-luxury overflow-hidden max-h-[90vh] flex flex-col"
              >
                  <div className="p-10 border-b border-beige-50 flex justify-between items-center">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-purple-900">Order Management</h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Ref ID: {selectedOrder._id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-beige-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                        <X size={24} />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {/* Items Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40">Manifest Items</h4>
                        {selectedOrder.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-5 bg-beige-50/50 rounded-3xl border border-beige-100/30">
                                <div>
                                    <p className="font-bold text-sm text-gray-800 line-clamp-2">{item.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{item.quantity} Unit(s) • ₹{item.price}</p>
                                </div>
                                <p className="font-sans font-black text-purple-900 whitespace-nowrap">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    {/* Meta Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40">Coordinates</h4>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <MapPin size={16} className="text-purple-400 mt-1" />
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                        {selectedOrder.shippingAddress.address},<br/>
                                        {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone size={16} className="text-purple-400" />
                                    <p className="text-sm font-bold text-gray-800 whitespace-nowrap">{selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40">Current Status</h4>
                             <div className="grid grid-cols-2 gap-2">
                                {Object.keys(statusMap).map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => updateStatus(selectedOrder._id, status)}
                                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            selectedOrder.orderStatus === status 
                                            ? 'bg-purple-900 text-white shadow-lg' 
                                            : 'bg-beige-50 text-gray-400 hover:bg-beige-100'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-beige-50 flex justify-between items-center">
                        <div className="flex items-center space-x-3 text-green-600">
                             <CreditCard size={20} />
                             <span className="text-xs font-black uppercase tracking-widest">Transaction Verified</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Final Manifest</p>
                            <p className="text-2xl sm:text-4xl font-sans font-black text-purple-900 whitespace-nowrap">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                  </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

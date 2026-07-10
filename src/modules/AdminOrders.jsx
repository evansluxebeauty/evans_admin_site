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
          className="space-y-4"
        >
          {orders.map((order) => (
            <motion.div 
                key={order._id}
                variants={itemVariants}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-purple-200 transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row md:items-center gap-4"
            >
                <div className="flex justify-between items-start md:w-1/3">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Order ID</p>
                        <h3 className="font-sans font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</h3>
                    </div>
                    <div className="md:hidden">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusMap[order.orderStatus]?.bg} ${statusMap[order.orderStatus]?.text}`}>
                            {statusMap[order.orderStatus]?.label}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center md:w-2/3">
                    <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Customer</p>
                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{order.shippingAddress.name}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <div className="hidden md:block">
                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusMap[order.orderStatus]?.bg} ${statusMap[order.orderStatus]?.text}`}>
                                {statusMap[order.orderStatus]?.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Total</p>
                            <p className="text-base font-bold text-purple-900">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
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
        {selectedOrder &&           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center sm:p-4">
             <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-gray-50 w-full max-w-2xl rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                  <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="font-sans text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-gray-500 text-xs font-medium mt-0.5">ID: {selectedOrder._id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
                        <X size={18} />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    
                    {/* Status Update Grid */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                         <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Update Status</h4>
                         <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {Object.keys(statusMap).map(status => (
                                <button 
                                    key={status}
                                    onClick={() => updateStatus(selectedOrder._id, status)}
                                    className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all border ${
                                        selectedOrder.orderStatus === status 
                                        ? 'bg-purple-900 text-white border-purple-900 shadow-md' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {statusMap[status].label}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Coordinates & Shipping */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Shipping Info</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <p className="text-sm font-medium text-gray-700 leading-snug">
                                    <span className="font-bold text-gray-900 block mb-1">{selectedOrder.shippingAddress.name}</span>
                                    {selectedOrder.shippingAddress.address},<br/>
                                    {selectedOrder.shippingAddress.city} - {selectedOrder.shippingAddress.pincode}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone size={18} className="text-gray-400" />
                                <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Items ({selectedOrder.items.length})</h4>
                        <div className="space-y-3">
                            {selectedOrder.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex-1 pr-4">
                                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                                        <p className="text-xs font-medium text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <p className="font-bold text-gray-900 whitespace-nowrap">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                  
                  {/* Footer Total */}
                  <div className="p-5 border-t border-gray-200 bg-white flex justify-between items-center sticky bottom-0 z-10">
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-md">
                           <CreditCard size={16} />
                           <span className="text-[10px] font-bold uppercase tracking-wider">Paid Online</span>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Total Amount</p>
                          <p className="text-2xl font-black text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                      </div>
                  </div>
              </motion.div>
          </div>    </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

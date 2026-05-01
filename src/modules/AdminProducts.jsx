'use client';
import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Upload, Trash2, PlusCircle, MinusCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminProductCard from '../components/AdminProductCard';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';

const CATEGORIES = ['Hair Oil', 'Serum', 'Cream', 'Cleanser', 'Mask', 'Toner', 'Supplement', 'Other'];

const defaultForm = {
  name: '',
  price: '',
  discountPercentage: 0,
  category: '',
  description: '',
  stock: 0,
  isActive: true,
  benefits: [''],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [lastUsedCategory, setLastUsedCategory] = useState('');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminLastCategory') || '' : '';
    setLastUsedCategory(saved);
  }, []);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ ...defaultForm, category: lastUsedCategory });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingProduct(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      discountPercentage: product.discountPercentage || 0,
      category: product.category || '',
      description: product.description || '',
      stock: product.stock || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      benefits: product.benefits && product.benefits.length > 0 ? product.benefits : [''],
    });
    setPreviewUrls(product.images || []);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const addBenefit = () => setFormData(f => ({ ...f, benefits: [...f.benefits, ''] }));
  const removeBenefit = (idx) => setFormData(f => ({ ...f, benefits: f.benefits.filter((_, i) => i !== idx) }));
  const updateBenefit = (idx, val) => setFormData(f => {
    const b = [...f.benefits];
    b[idx] = val;
    return { ...f, benefits: b };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Name, price, and category are required');
      return;
    }
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'benefits') {
        const cleaned = formData.benefits.filter(b => b.trim() !== '');
        data.append(key, JSON.stringify(cleaned));
      } else {
        data.append(key, formData[key]);
      }
    });

    selectedFiles.forEach(file => data.append('images', file));

    try {
      const url = editingProduct
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success(`Product ${editingProduct ? 'updated' : 'created'} — storefront synced!`);
        setIsModalOpen(false);
        setLastUsedCategory(formData.category);
        localStorage.setItem('adminLastCategory', formData.category);
        resetForm();
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Something went wrong');
      }
    } catch {
      toast.error('Server error. Check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (product) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (res.ok) {
        toast.success(`Product is now ${!product.isActive ? 'visible on storefront' : 'hidden from storefront'}`);
        fetchProducts();
      }
    } catch {
      toast.error('Sync error');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass = "w-full bg-beige-50 border border-transparent focus:border-purple-200 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white transition-all placeholder-gray-300";
  const labelClass = "text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1.5 block";

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-purple-900">Inventory</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-12 h-12 bg-purple-900 text-gold-300 rounded-2xl flex items-center justify-center shadow-luxury hover:scale-110 transition-transform duration-300"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-beige-100/50 shadow-sm text-sm rounded-[2rem] py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-purple-900/5 transition-all font-medium"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto no-scrollbar space-x-3 mb-10">
        <button
          onClick={() => setSearchQuery('')}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${!searchQuery ? 'bg-purple-900 text-white shadow-luxury' : 'bg-white text-gray-500 border border-beige-100 hover:border-purple-200'}`}
        >
          All
        </button>
        {[...new Set(products.map(p => p.category))].map(cat => (
          <button
            key={cat}
            onClick={() => setSearchQuery(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${searchQuery === cat ? 'bg-purple-900 text-white shadow-luxury' : 'bg-white text-gray-400 border border-beige-100 hover:border-purple-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AdminProductCard product={product} onEdit={openEditModal} onToggleVisibility={toggleVisibility} />
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium">
              No products found. Try a different search or <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="text-purple-600 underline">add a new one</button>.
            </div>
          )}
        </motion.div>
      )}

      {/* ── FULL PRODUCT MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-purple-900/40 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white w-full max-w-5xl rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 sm:px-10 py-5 sm:py-7 border-b border-beige-100 flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-purple-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-semibold mt-0.5 uppercase tracking-widest">
                    {editingProduct ? 'Changes sync instantly to guest storefront' : 'Will appear on storefront after saving'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="w-10 h-10 bg-beige-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex-shrink-0 ml-4"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto flex flex-col relative custom-scrollbar">
                <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 flex-grow">

                  {/* ─── LEFT: Images + Visibility ─── */}
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Product Images (max 5)</label>
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group shadow-sm">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute inset-0 bg-red-500/80 text-white flex sm:opacity-0 sm:group-hover:opacity-100 items-center justify-center transition-opacity rounded-2xl"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                        {previewUrls.length < 5 && (
                          <label className="aspect-square rounded-2xl bg-beige-50 border-2 border-dashed border-beige-200 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
                            <Upload size={20} className="text-purple-300 mb-1.5 sm:size-24" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Upload</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-2">Uploading new images replaces existing ones.</p>
                    </div>

                    {/* Active Toggle */}
                    <div className="bg-beige-50 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                      <div className="pr-4">
                        <p className="font-semibold text-sm text-gray-800">Visible on Storefront</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                          {formData.isActive ? 'Customers can see & buy this product' : 'Hidden from all customers'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, isActive: !f.isActive }))}
                        className="transition-transform hover:scale-105 flex-shrink-0"
                      >
                        {formData.isActive
                          ? <ToggleRight size={44} className="text-purple-700 sm:w-[48px] sm:h-[48px]" />
                          : <ToggleLeft size={44} className="text-gray-300 sm:w-[48px] sm:h-[48px]" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* ─── RIGHT: All Details ─── */}
                  <div className="space-y-5">

                    {/* Name */}
                    <div>
                      <label className={labelClass}>Product Name *</label>
                      <input
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        required
                        placeholder="e.g. Botanical Hair Growth Oil"
                        className={inputClass}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className={labelClass}>Category *</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                        required
                        className={inputClass}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Price & Discount */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Price (₹) *</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.price}
                          onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                          required
                          placeholder="499"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={e => setFormData(f => ({ ...f, discountPercentage: e.target.value }))}
                          placeholder="10"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    {/* Stock Management */}
                    <div>
                      <label className={labelClass}>Stock Management</label>
                      {/* Current stock display */}
                      <div className={`mb-3 flex items-center justify-between px-5 py-3 rounded-2xl ${
                        formData.stock === 0 ? 'bg-red-50 border border-red-200' :
                        formData.stock < 10 ? 'bg-amber-50 border border-amber-200' :
                        'bg-green-50 border border-green-200'
                      }`}>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600">Current Stock</span>
                        <span className={`text-xl font-black ${
                          formData.stock === 0 ? 'text-red-600' :
                          formData.stock < 10 ? 'text-amber-600' : 'text-green-700'
                        }`}>
                          {formData.stock} units
                          {formData.stock === 0 && <span className="text-[10px] ml-2 uppercase tracking-widest">● Out of Stock</span>}
                          {formData.stock > 0 && formData.stock < 10 && <span className="text-[10px] ml-2 uppercase tracking-widest">● Low</span>}
                        </span>
                      </div>
                      {/* Live stock count and adjustment */}
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(f => ({ ...f, stock: Math.max(0, Number(f.stock) - 1) }))}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm"
                        >
                          <MinusCircle size={22} />
                        </button>
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={e => setFormData(f => ({ ...f, stock: Math.max(0, Number(e.target.value)) }))}
                            className={`${inputClass} text-center text-lg font-black bg-white shadow-inner border-beige-200`}
                          />
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Available Units
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(f => ({ ...f, stock: Number(f.stock) + 1 }))}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-green-50 text-green-600 hover:bg-green-100 transition-all shadow-sm"
                        >
                          <PlusCircle size={22} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                        rows={4}
                        placeholder="Describe the product, ingredients, usage instructions..."
                        className={`${inputClass} resize-none leading-relaxed`}
                      />
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={labelClass + " mb-0"}>Key Benefits</label>
                        <button
                          type="button"
                          onClick={addBenefit}
                          className="flex items-center space-x-1 text-purple-600 hover:text-purple-900 text-xs font-bold transition-colors"
                        >
                          <PlusCircle size={15} />
                          <span>Add Benefit</span>
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {formData.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full flex-shrink-0" />
                            <input
                              value={benefit}
                              onChange={e => updateBenefit(idx, e.target.value)}
                              placeholder={`e.g. Reduces hair fall by 80%`}
                              className={inputClass + " flex-1"}
                            />
                            {formData.benefits.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBenefit(idx)}
                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <MinusCircle size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 sm:px-10 py-5 sm:py-6 border-t border-beige-100 bg-beige-50/50 flex gap-3 sm:gap-4 flex-shrink-0 pb-safe">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                    className="flex-1 border-2 border-beige-200 text-gray-500 font-bold py-3.5 sm:py-4 rounded-2xl hover:bg-beige-100 transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[1.3] bg-purple-900 text-white font-bold py-3.5 sm:py-4 rounded-2xl hover:bg-purple-800 transition-colors shadow-luxury text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : editingProduct ? '✓ Save Changes' : '+ Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;

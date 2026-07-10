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
  category: CATEGORIES[0],
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
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminLastCategory') : null;
    setLastUsedCategory(saved || CATEGORIES[0]);
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
    setFormData({ ...defaultForm, category: lastUsedCategory || CATEGORIES[0] });
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

  const handleDeleteProduct = async (product) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      }
    } catch {
      toast.error('Failed to delete product');
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

      {/* Category Pills — sticky strip, visible on all screens */}
      <div className="filter-strip sticky top-0 z-10 -mx-6 md:-mx-12 px-6 md:px-12 py-3 mb-6 bg-beige-50/95 backdrop-blur-sm border-b border-beige-100/60">
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setSearchQuery('')}
            className={`!min-h-0 !min-w-0 flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-black transition-all uppercase tracking-widest ${!searchQuery
                ? 'bg-purple-900 text-white shadow-luxury'
                : 'bg-white text-gray-500 border border-beige-200 hover:border-purple-300 hover:text-purple-700'
              }`}
          >
            All
          </button>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <button
              key={cat}
              onClick={() => setSearchQuery(cat)}
              className={`!min-h-0 !min-w-0 flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-black transition-all uppercase tracking-widest ${searchQuery === cat
                  ? 'bg-purple-900 text-white shadow-luxury'
                  : 'bg-white text-gray-400 border border-beige-200 hover:border-purple-300 hover:text-purple-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
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
              <AdminProductCard product={product} onEdit={openEditModal} />
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium">
              No products found. Try a different search or <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="text-purple-600 underline">add a new one</button>.
            </div>
          )}
        </motion.div>
      )}

      {/* Modern Full Sheet Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-4xl rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-20">
                <div>
                  <h2 className="font-sans text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  {editingProduct && <p className="text-gray-500 text-xs font-medium mt-0.5">ID: {editingProduct._id}</p>}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all flex-shrink-0"
                >
                  <X size={18} />
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
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(f => ({ ...f, stock: Math.max(0, Number(f.stock) - 1) }))}
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm"
                        >
                          <MinusCircle size={22} />
                        </button>
                        <input
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={e => setFormData(f => ({ ...f, stock: Math.max(0, Number(e.target.value)) }))}
                            className={`${inputClass} text-center text-lg font-black bg-white shadow-inner border-beige-200`}
                        />
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

                <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-20">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); resetForm(); }}
                    className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-purple-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-purple-800 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
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

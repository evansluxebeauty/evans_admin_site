// v2.1 — single-line category+stock fix
'use client';
import React from 'react';
import { Edit2, Eye, EyeOff, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProductCard = ({ product, onEdit, onToggleVisibility }) => {
  const discountedPrice = product.discountPercentage > 0
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-[2.5rem] p-4 shadow-luxury hover:shadow-2xl transition-all duration-500 relative group h-full flex flex-col justify-between border border-beige-100/50"
    >
      <div className="relative rounded-[2rem] overflow-hidden aspect-square mb-4 bg-beige-50">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${!product.isActive ? 'grayscale opacity-50' : ''}`}
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.isActive && (
            <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Hidden
            </div>
          )}
          {product.stock === 0 && (
            <div className="bg-red-600/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Out of Stock
            </div>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <div className="bg-gold-400/90 backdrop-blur-md text-purple-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Low Stock
            </div>
          )}
        </div>

        {product.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(product)}
            className="bg-white text-purple-900 p-3 rounded-2xl shadow-xl hover:bg-purple-900 hover:text-white transition-all"
          >
            <Edit2 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleVisibility(product)}
            className={`${product.isActive ? 'bg-white text-green-600' : 'bg-red-500 text-white'} p-3 rounded-2xl shadow-xl transition-all`}
          >
            {product.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
          </motion.button>
        </div>
      </div>

      <div className="px-1 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-2 min-w-0">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap truncate min-w-0">{product.category}</span>
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-purple-400 flex-shrink-0 whitespace-nowrap">
              <Package size={10} />
              <span>Stock: {product.stock}</span>
            </div>
          </div>
          <h3 className="font-serif font-bold text-purple-900 text-lg leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-row items-center space-x-2 flex-wrap">
            <span className="font-sans font-extrabold text-lg text-gray-900 whitespace-nowrap">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[10px] text-gray-400 line-through whitespace-nowrap">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            onClick={() => onEdit(product)}
            className="text-purple-600 text-[10px] font-bold hover:text-purple-900 transition-colors uppercase tracking-widest border-b border-purple-200"
          >
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProductCard;

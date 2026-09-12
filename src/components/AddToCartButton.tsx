'use client'

import { useCartStore } from '@/lib/cart-store';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents link bubbling if wrapped inside a Link
    addItem(product);
    toast.success(`Added ${product.name} to bag`, {
      style: {
        background: '#121A16',
        color: '#10B981',
        border: '1px solid rgba(16,185,129,0.3)',
        fontSize: '12px',
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#000000',
      },
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-[11px] py-3 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(5,150,105,0.4)] hover:shadow-[0_4px_25px_rgba(5,150,105,0.7)] active:scale-95 cursor-pointer border border-emerald-500/50"
    >
      <ShoppingBag className="w-4 h-4 text-white stroke-[2.5]" />
      <span>Add to Bag</span>
    </button>
  );
}
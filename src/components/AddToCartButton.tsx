'use client'

import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
    });
    
    // Sleek dark-mode toast matching your global theme
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#121A16',
        color: '#10B981',
        border: '1px solid rgba(16,185,129,0.3)',
      },
      iconTheme: {
        primary: '#10B981',
        secondary: '#090D0B',
      },
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-emerald-500 text-black py-2 rounded-md text-[11px] md:text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-sm"
    >
      Add to Cart
    </button>
  );
}
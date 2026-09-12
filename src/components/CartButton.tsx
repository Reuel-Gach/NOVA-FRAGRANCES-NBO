'use client'

import { useCartStore } from '@/lib/cart-store';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total item quantity
  const totalItems = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_25px_rgba(5,150,105,0.7)] transition-all duration-300 border border-emerald-500/50 cursor-pointer"
    >
      <ShoppingBag className="w-4 h-4 text-white stroke-[2.5]" />
      <span className="hidden sm:inline">Bag</span>
      
      {/* Live Item Counter Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-400 text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
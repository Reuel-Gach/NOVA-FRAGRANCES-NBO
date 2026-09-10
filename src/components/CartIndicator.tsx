'use client'
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useEffect, useState } from 'react';

export default function CartIndicator() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only showing the cart count after the component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

return (
  <Link href="/cart" className="flex items-center gap-1.5 text-gray-600 hover:text-black">
    <ShoppingBag className="w-5 h-5" />
    <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-full">
      {mounted ? itemCount : 0}
    </span>
  </Link>
);
}
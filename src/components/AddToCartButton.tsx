'use client'

import { useCartStore } from '@/lib/cart-store';

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      onClick={() => addItem({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || '',
      })}
      className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors active:scale-95"
    >
      Add to Cart
    </button>
  );
}
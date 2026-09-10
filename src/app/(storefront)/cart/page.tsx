'use client'

import { useCartStore } from '@/lib/cart-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#090D0B] text-white">
        <h1 className="text-3xl font-serif text-white mb-4 tracking-tight">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8 max-w-sm">Explore our signature collection and claim your scent.</p>
        <Link href="/" className="bg-emerald-500 text-black font-extrabold tracking-widest uppercase px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D0B] text-white py-12 px-4 md:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-tight">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Order Summary Column */}
          <div className="bg-[#121A16] border border-emerald-500/20 p-6 md:p-8 rounded-2xl shadow-2xl h-fit">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-emerald-500/10 text-emerald-400">Order Items</h2>
            <div className="space-y-6 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center border-b border-emerald-500/10 pb-4">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-emerald-500/30 bg-black" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center text-xs font-bold text-emerald-400 border border-emerald-500/30">NOVA</div>
                    )}
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">Qty: {item.quantity} × Ksh {item.price}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-amber-400">Ksh {item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.product_id)} className="text-xs font-bold text-red-400 hover:text-red-300 tracking-wider uppercase transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-emerald-500/10">
              <span className="text-gray-300">Total Amount</span>
              <span className="text-amber-400 font-serif text-2xl">Ksh {totalAmount}</span>
            </div>
          </div>

          {/* Checkout Form Column */}
          <div className="bg-[#121A16] border border-emerald-500/20 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-emerald-500/10 text-emerald-400">Checkout Details</h2>
            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Full Name</label>
                <input required type="text" name="customer_name" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Phone Number (M-Pesa / WhatsApp)</label>
                <input required type="tel" name="customer_phone" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="07XX XXX XXX" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">General Location / Town</label>
                <input required type="text" name="location" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="e.g. Ruiru, Kiambu" />
              </div>

              {/* Sacco Fulfillment Disclaimer with Glowing Border */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl mt-6 backdrop-blur-sm">
                <p className="text-xs md:text-sm text-emerald-300 font-medium leading-relaxed text-center">
                  Delivery fees are not included. We will contact you to arrange delivery, and fees will be paid directly to the Sacco/Rider upon receipt.
                </p>
              </div>

              <button type="submit" className="w-full bg-emerald-500 text-black font-extrabold tracking-widest uppercase py-4 px-4 rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all mt-6 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                Complete Order
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
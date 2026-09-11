'use client'

import { useCartStore } from '@/lib/cart-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { processOrder } from './actions';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle Form Submission
  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    
    // Extract data on the client to avoid Next.js serialization bugs
    const payload = {
      customerName: formData.get('customer_name') as string,
      customerPhone: formData.get('customer_phone') as string,
      location: formData.get('location') as string,
      totalAmount,
      items
    };
    
    try {
      await processOrder(payload);
      
      clearCart();
      toast.success('Order placed successfully! We will contact you soon.', {
        style: { background: '#121A16', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
      });
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#090D0B] text-white">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-serif text-white mb-4 tracking-tight">Your Cart is Empty</h1>
        <Link href="/" className="bg-emerald-500 text-black font-extrabold tracking-widest uppercase px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition-all">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D0B] text-white py-12 px-4 md:px-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-tight">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-[#121A16] border border-emerald-500/20 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-emerald-500/10 text-emerald-400">Order Items</h2>
            <div className="space-y-6 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center border-b border-emerald-500/10 pb-4">
                  <div>
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-amber-400">Ksh {item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.product_id)} className="text-xs font-bold text-red-400 hover:text-red-300 uppercase">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xl font-bold pt-4">
              <span className="text-gray-300">Total</span>
              <span className="text-amber-400">Ksh {totalAmount}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-[#121A16] border border-emerald-500/20 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-emerald-500/10 text-emerald-400">Checkout Details</h2>
            <form onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Full Name</label>
                <input required type="text" name="customer_name" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Phone Number</label>
                <input required type="tel" name="customer_phone" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" placeholder="07XX XXX XXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Location</label>
                <input required type="text" name="location" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500" placeholder="Ruiru, Kiambu" />
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-emerald-500 text-black font-extrabold uppercase py-4 rounded-xl hover:bg-emerald-400 disabled:opacity-50 mt-6">
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
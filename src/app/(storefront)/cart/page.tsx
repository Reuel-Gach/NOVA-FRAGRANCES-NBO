'use client'

import { useCartStore } from '@/lib/cart-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { processOrder } from './actions';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  async function handleCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    
    const payload = {
      customerName: formData.get('customer_name') as string,
      customerPhone: formData.get('customer_phone') as string,
      location: formData.get('location') as string,
      totalAmount,
      items
    };
    
    try {
      const result = await processOrder(payload);
      
      clearCart();
      toast.success('Order placed successfully!', {
        style: { background: '#121A16', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
      });
      
      setTimeout(() => router.push(`/order/${result.orderId}/success`), 1500);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#060908] text-white">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-serif text-white mb-4 tracking-tight">Your Bag is Empty</h1>
        <p className="text-gray-400 text-xs mb-6">Explore our curated collection and add your signature scent.</p>
        <Link href="/" className="bg-emerald-500 text-black font-extrabold tracking-widest uppercase text-xs px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060908] text-white py-10 px-4 md:px-8 selection:bg-emerald-500 selection:text-black">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-8 tracking-tight">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Items List */}
          <div className="lg:col-span-7 bg-[#0E1512] border border-emerald-500/20 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 pb-3 border-b border-emerald-500/10">Selected Fragrances</h2>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-black rounded-xl overflow-hidden border border-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="object-contain w-full h-full p-1" />
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">Nova</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-sm text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-amber-400 font-bold mt-0.5">Ksh {item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    {/* Quantity Stepper Controls */}
                    <div className="flex items-center bg-black border border-emerald-500/30 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <input 
                        type="number" 
                        min="1" 
                        max={item.stock_quantity}
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                        className="w-10 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                      />

                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white block">Ksh {(item.price * item.quantity).toLocaleString()}</span>
                      <button 
                        onClick={() => removeItem(item.product_id)} 
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider mt-1 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-base font-bold pt-6 mt-2 border-t border-emerald-500/20">
              <span className="text-gray-300 uppercase text-xs tracking-widest">Total Amount</span>
              <span className="text-amber-400 font-mono text-lg">Ksh {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5 bg-[#0E1512] border border-emerald-500/20 p-6 rounded-3xl shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6 pb-3 border-b border-emerald-500/10">Customer Details</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input required type="text" name="customer_name" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="e.g. Reuel Gachuki" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                <input required type="tel" name="customer_phone" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="07XX XXX XXX" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delivery Location</label>
                <input required type="text" name="location" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ruiru, Kiambu" />
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-emerald-500 text-black font-extrabold uppercase text-xs tracking-widest py-4 rounded-xl hover:bg-emerald-400 disabled:opacity-50 mt-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing Order...' : <>Complete Secure Order <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
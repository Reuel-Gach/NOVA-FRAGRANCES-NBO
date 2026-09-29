'use client'

import { useCartStore } from '@/lib/cart-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, MessageCircle } from 'lucide-react';

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
    const orderId = crypto.randomUUID();
    
    const payload = {
      orderId,
      customerName: formData.get('customer_name') as string,
      phone: formData.get('customer_phone') as string,
      location: formData.get('location') as string,
      amount: totalAmount,
      items
    };
    
    try {
      // Send to the new manual checkout API route
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order');
      }

      // Success! Clear cart and redirect to success page
      clearCart();
      localStorage.setItem('nova_has_ordered', 'true');
      toast.success('Order Received! We will WhatsApp you shortly.');
      router.push(`/order/${orderId}/success`);

    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.');
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-[#060908] text-gray-900 dark:text-white transition-colors">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-serif mb-4 tracking-tight">Your Bag is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Explore our curated collection and add your signature scent.</p>
        <Link href="/" className="bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-extrabold tracking-widest uppercase text-xs px-8 py-3.5 rounded-xl hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all shadow">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#060908] text-gray-900 dark:text-white py-10 px-4 md:px-8 selection:bg-emerald-500 selection:text-black transition-colors duration-300">
      <Toaster position="top-center" />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif mb-8 tracking-tight">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Items List */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 p-6 rounded-3xl shadow-xl transition-colors">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 pb-3 border-b border-emerald-500/10">Selected Fragrances</h2>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white dark:bg-black rounded-xl overflow-hidden border border-emerald-500/20 flex-shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="object-contain w-full h-full p-1" />
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold">Nova</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">Ksh {item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center bg-white dark:bg-black border border-emerald-500/30 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                        className="w-10 bg-transparent text-center text-xs font-bold text-gray-900 dark:text-white focus:outline-none"
                      />
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-900 dark:text-white block">Ksh {(item.price * item.quantity).toLocaleString()}</span>
                      <button 
                        onClick={() => removeItem(item.product_id)} 
                        className="text-[10px] font-bold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 uppercase tracking-wider mt-1 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-base font-bold pt-6 mt-2 border-t border-emerald-500/20">
              <span className="text-gray-600 dark:text-gray-300 uppercase text-xs tracking-widest">Total Amount</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono text-lg">Ksh {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 p-6 rounded-3xl shadow-xl transition-colors">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 pb-3 border-b border-emerald-500/10">Delivery Details</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input required type="text" name="customer_name" className="w-full rounded-xl bg-white dark:bg-black border border-emerald-500/30 px-4 py-3 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"  />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">WhatsApp Number</label>
                <input required type="tel" name="customer_phone" className="w-full rounded-xl bg-white dark:bg-black border border-emerald-500/30 px-4 py-3 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="07XX XXX XXX (For payment info)" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1.5">Delivery Location</label>
                <input required type="text" name="location" className="w-full rounded-xl bg-white dark:bg-black border border-emerald-500/30 px-4 py-3 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="E.g. Kimbo, Ruiru" />
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-extrabold uppercase text-xs tracking-widest py-4 rounded-xl disabled:opacity-50 mt-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : <>Place Order & Arrange Delivery <MessageCircle className="w-4 h-4" /></>}
              </button>
              
              <p className="text-[10px] text-gray-500 text-center mt-3">
                Nova Fragrances Nbo will contact you via WhatsApp to arrange secure payment and dispatch.
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
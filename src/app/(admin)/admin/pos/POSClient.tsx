'use client'

import { useState } from 'react';
import { recordPOSSale } from './actions';
import toast from 'react-hot-toast';
import { Plus, Minus, Trash2, ShoppingBag, User, Phone } from 'lucide-react';

export default function POSClient({ products }: { products: any[] }) {
  const [ticket, setTicket] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New states for customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const addToTicket = (product: any) => {
    setTicket((prev) => {
      const existing = prev.find((item) => item.product_id === product.product_id);
      if (existing) {
        return prev.map((item) => item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setTicket((prev) => prev.map((item) => {
      if (item.product_id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setTicket((prev) => prev.filter((item) => item.product_id !== id));
  };

  const totalAmount = ticket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (ticket.length === 0) return;
    setIsProcessing(true);
    try {
      // Pass the new data to the server action
      await recordPOSSale(ticket, totalAmount, customerName, customerPhone);
      
      // Reset the till completely
      setTicket([]);
      setCustomerName('');
      setCustomerPhone('');
      
      toast.success('Sale recorded successfully!', {
         style: { background: '#121A16', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
      });
    } catch (error) {
      toast.error('Failed to record sale.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Product Grid */}
      <div className="flex-1 bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-emerald-400 mb-6">Available Inventory</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map(product => (
            <button
              key={product.product_id}
              onClick={() => addToTicket(product)}
              className="flex flex-col items-start p-3 bg-black border border-emerald-500/10 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all text-left group"
            >
              <span className="text-xs font-bold text-gray-500 mb-1">Stock: {product.stock_quantity}</span>
              <span className="text-sm font-bold text-white group-hover:text-emerald-400 line-clamp-1 mb-2">{product.name}</span>
              <span className="text-amber-400 font-bold mt-auto text-sm">Ksh {product.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Ticket / Till */}
      <div className="w-full lg:w-96 bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 flex flex-col h-fit sticky top-24">
        <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> Current Ticket
        </h2>

        {ticket.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Select products to start sale</div>
        ) : (
          <div className="space-y-4 mb-6 flex-grow max-h-[400px] overflow-y-auto pr-2">
            {ticket.map(item => (
              <div key={item.product_id} className="flex flex-col bg-black p-3 rounded-xl border border-emerald-500/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-gray-200">{item.name}</span>
                  <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold text-sm">Ksh {item.price * item.quantity}</span>
                  <div className="flex items-center gap-3 bg-[#121A16] rounded-lg p-1 border border-emerald-500/20">
                    <button onClick={() => updateQuantity(item.product_id, -1)} className="p-1 hover:text-emerald-400"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, 1)} className="p-1 hover:text-emerald-400"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-emerald-500/20 pt-4 mt-auto">
          {/* New Customer Details Section */}
          <div className="space-y-3 mb-6 bg-black/40 p-4 rounded-xl border border-emerald-500/10">
            <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Customer Info (Optional)</h3>
            <div className="relative">
              <User className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Name" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#121A16] border border-emerald-500/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-600"
              />
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#121A16] border border-emerald-500/20 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Total</span>
            <span className="text-2xl font-serif text-amber-400">Ksh {totalAmount}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={ticket.length === 0 || isProcessing}
            className="w-full bg-emerald-500 text-black font-extrabold uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            {isProcessing ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
'use client'

import Link from 'next/link';
import { CheckCircle2, Download, MessageCircle, ArrowRight, Store } from 'lucide-react';

export default function ReceiptView({ order, items }: { order: any; items: any[] }) {
  // WhatsApp message addressing the business
  const whatsappMsg = encodeURIComponent(
    `Hi Nova Fragrances Nbo, I have just placed order #${order.order_id.slice(0, 8).toUpperCase()} for Ksh ${Number(order.total_price).toLocaleString()}. Please confirm dispatch!`
  );
  const whatsappUrl = `https://wa.me/254106935284?text=${whatsappMsg}`;

  return (
    <main className="min-h-screen bg-[#060908] text-white p-4 md:p-8 flex items-center justify-center selection:bg-emerald-500 selection:text-black">
      <div className="max-w-xl w-full mx-auto">
        
        {/* Success Header Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-400 text-xs md:text-sm">
            Thank you, <span className="text-white font-bold">{order.customer_name}</span>. Your order has been registered and is being prepared for dispatch.
          </p>
        </div>

        {/* Digital Receipt Card */}
        <div id="printable-receipt" className="bg-[#0E1512] border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden mb-6">
          
          {/* Receipt Header */}
          <div className="flex justify-between items-start pb-6 border-b border-emerald-500/10 mb-6">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest block mb-1">Nova Fragrances</span>
              <h2 className="text-lg font-serif text-white">Official Receipt</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase block">Order ID</span>
              <span className="text-xs font-mono text-amber-400 font-bold">#{order.order_id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          {/* Customer & Delivery Meta */}
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-emerald-500/10 mb-6 text-xs">
            <div>
              <span className="text-gray-500 uppercase tracking-widest block mb-1 text-[10px]">Customer Phone</span>
              <span className="text-gray-200 font-medium">{order.customer_phone}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase tracking-widest block mb-1 text-[10px]">Delivery Location</span>
              <span className="text-gray-200 font-medium">{order.location}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-6">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Purchased Items</span>
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-black flex items-center justify-center text-xs text-emerald-400 font-bold border border-emerald-500/20">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-200 font-medium">{item.product_name || 'Fragrance Bottle'}</span>
                </div>
                <span className="text-gray-300 font-mono">Ksh {(Number(item.price_at_purchase) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="pt-4 border-t border-emerald-500/20 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
            <span className="text-xl font-bold text-amber-400 font-mono">Ksh {Number(order.total_price).toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Print / Download Button */}
          <button 
            onClick={() => window.print()}
            className="w-full bg-[#121A16] hover:bg-[#1A2620] border border-emerald-500/30 text-emerald-400 font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download / Print Receipt PDF
          </button>

          {/* WhatsApp Confirmation */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-widest py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <MessageCircle className="w-4 h-4 fill-black text-emerald-500" /> Send Confirmation on WhatsApp
          </a>

          {/* Return to Store */}
          <div className="text-center pt-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors">
              <Store className="w-3.5 h-3.5" /> Return to Storefront <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            border: none !important;
            box-shadow: none !important;
          }
          #printable-receipt span, #printable-receipt h2, #printable-receipt div {
            color: #000000 !important;
          }
          #printable-receipt .text-amber-400 {
            color: #b45309 !important;
          }
          #printable-receipt .text-emerald-500, #printable-receipt .text-emerald-400 {
            color: #047857 !important;
          }
        }
      `}</style>
    </main>
  );
}
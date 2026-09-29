import { sql } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, MessageCircle, MapPin, Search } from 'lucide-react';

// Notice params is now a Promise and we are looking for 'id'
export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params (Next.js 15 requirement) and extract the 'id'
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  if (!orderId) return notFound();

  // Fetch order details
  const orders = await sql`
    SELECT o.*, 
           json_agg(json_build_object('name', p.name, 'quantity', oi.quantity, 'price', oi.price_at_purchase)) as items
    FROM Orders o
    LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
    LEFT JOIN Products p ON oi.product_id = p.product_id
    WHERE o.order_id = ${orderId}
    GROUP BY o.order_id
  `;

  // If no order is found, this is what triggers the 404
  if (orders.length === 0) return notFound();
  
  const order = orders[0];
  // Extract a shorter tracking ID (first 8 characters) for better UX
  const shortTrackingId = order.order_id.substring(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#090D0B] text-white py-12 px-4 flex flex-col items-center selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Main Success Header */}
      <div className="text-center mb-10 max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-3xl font-serif text-white mb-4">Order Request Received!</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Thank you, <span className="text-white font-bold">{order.customer_name}</span>. 
          <strong className="text-emerald-400 block mt-2">Nova Fragrances Nbo will message you on WhatsApp shortly to confirm payment and arrange dispatch.</strong>
        </p>
      </div>

      {/* 2. Tracking Instructions Box */}
      <div className="w-full max-w-2xl bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
            <Search className="w-4 h-4" /> How to track your order
          </h3>
          <p className="text-gray-400 text-xs">
            Save your Tracking ID. You can use the <strong>Track Order</strong> link in the top menu at any time to see your delivery status.
          </p>
        </div>
        <div className="bg-black border border-emerald-500/30 px-4 py-2 rounded-lg flex items-center gap-3">
          <span className="font-mono text-emerald-400 font-bold tracking-widest">{shortTrackingId}</span>
        </div>
      </div>

      {/* 3. Order Summary Card */}
      <div className="w-full max-w-2xl bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-start border-b border-emerald-500/10 pb-6 mb-6">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Nova Fragrances Nbo</p>
            <h2 className="text-xl font-serif text-white">Order Summary</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Pending Payment
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm border-b border-emerald-500/10 pb-6">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">WhatsApp Number</p>
            <p className="font-bold text-gray-200 flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-emerald-500" /> {order.customer_phone}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Delivery Location</p>
            <p className="font-bold text-gray-200 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-emerald-500" /> {order.location}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Requested Items</p>
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{item.quantity}x</span>
                <p className="text-sm font-bold text-gray-200">{item.name}</p>
              </div>
              <span className="font-mono text-sm text-gray-400">Ksh {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-emerald-500/20">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total Amount</span>
          <span className="text-2xl font-serif text-amber-400">Ksh {order.total_price}</span>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-widest border-b border-transparent hover:border-emerald-400 pb-1">
          Return to Storefront
        </Link>
      </div>
    </div>
  );
}
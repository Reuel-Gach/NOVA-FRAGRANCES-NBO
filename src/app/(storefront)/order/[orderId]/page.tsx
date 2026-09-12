import { sql } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;

  const orders = await sql`
    SELECT o.*, 
           json_agg(json_build_object('name', p.name, 'quantity', oi.quantity, 'price', oi.price_at_purchase, 'image_url', p.image_url)) as items
    FROM Orders o
    LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
    LEFT JOIN Products p ON oi.product_id = p.product_id
    WHERE o.order_id = ${orderId}
    GROUP BY o.order_id
  `;

  if (orders.length === 0) return notFound();
  
  const order = orders[0];
  const isCancelled = order.payment_status === 'Cancelled';
  const isCompleted = order.payment_status === 'Completed';

  return (
    <div className="min-h-[80vh] bg-[#090D0B] text-white p-4 md:p-8 flex items-center justify-center selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-2xl bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Status Glow */}
        <div className={`absolute top-0 left-0 w-full h-1 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_20px_#10B981]' : isCancelled ? 'bg-red-500 shadow-[0_0_20px_#EF4444]' : 'bg-amber-500 shadow-[0_0_20px_#FBBF24]'}`}></div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isCompleted ? <CheckCircle2 className="w-16 h-16 text-emerald-500" /> : 
             isCancelled ? <XCircle className="w-16 h-16 text-red-500" /> :
             <Clock className="w-16 h-16 text-amber-500" />}
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Order {order.payment_status}</h1>
          <p className="text-gray-400 text-sm tracking-widest font-mono">ID: {order.order_id}</p>
        </div>

        <div className="space-y-6">
          <div className="border-b border-emerald-500/10 pb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 mb-1">Name</span>
                <span className="font-bold text-gray-200">{order.customer_name}</span>
              </div>
              <div>
                <span className="block text-gray-500 mb-1">Location</span>
                <span className="font-bold text-gray-200">{order.location}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-emerald-500/10 pb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black rounded-lg border border-emerald-500/20 flex items-center justify-center p-1">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[8px] font-bold text-emerald-600 uppercase">Nova</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400">Ksh {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Total Paid</span>
            <span className="text-2xl font-serif text-amber-400">Ksh {order.total_price}</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
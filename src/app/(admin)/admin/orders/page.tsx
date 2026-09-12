import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Phone, MapPin, ArrowLeft } from 'lucide-react';
import OrderActions from './OrderActions'; 

export default async function AdminOrdersPage() {
  const orders = await sql`
    SELECT o.*, 
           json_agg(json_build_object('name', p.name, 'quantity', oi.quantity, 'price', oi.price_at_purchase)) as items
    FROM Orders o
    LEFT JOIN Order_Items oi ON o.order_id = oi.order_id
    LEFT JOIN Products p ON oi.product_id = p.product_id
    GROUP BY o.order_id
    ORDER BY o.order_id DESC
  `;

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold tracking-widest uppercase text-emerald-400">
            Live Order Queue
          </span>
        </div>
        <UserButton />
      </nav>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-white">Incoming Customer Orders</h1>
        <p className="text-gray-400 mb-8">Manage web purchases, coordinate with Sacco riders, and update fulfillment.</p>

        <div className="space-y-6">
          {orders.map((order: any) => {
            const cleanPhone = order.customer_phone.startsWith('0') 
              ? `254${order.customer_phone.slice(1)}` 
              : order.customer_phone;
            
            const isCancelled = order.payment_status === 'Cancelled';

            return (
              <div key={order.order_id} className={`bg-[#121A16] border rounded-2xl p-6 shadow-xl transition-all ${isCancelled ? 'border-red-500/20 opacity-75' : 'border-emerald-500/20'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-emerald-500/10 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className={`text-lg font-bold ${isCancelled ? 'text-gray-400 line-through' : 'text-white'}`}>{order.customer_name}</h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                        order.payment_status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                        isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><Phone className={`w-3.5 h-3.5 ${isCancelled ? 'text-red-400' : 'text-emerald-400'}`} /> {order.customer_phone}</span>
                      <span className="flex items-center gap-1.5"><MapPin className={`w-3.5 h-3.5 ${isCancelled ? 'text-red-400' : 'text-emerald-400'}`} /> {order.location}</span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <a 
                        href={`https://wa.me/${cleanPhone}?text=Hi%20${order.customer_name},%20we%20have%20received%20your%20Nova%20Fragrances%20order%20and%20are%20arranging%20dispatch%20to%20${order.location}.`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none text-center bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all"
                      >
                        WhatsApp
                      </a>
                      
                      {/* Client Component for Action Buttons */}
                      <OrderActions orderId={order.order_id} currentStatus={order.payment_status} />
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isCancelled ? 'text-red-400' : 'text-emerald-400'}`}>Purchased Fragrances</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className={`bg-black/40 border p-3 rounded-xl flex justify-between items-center ${isCancelled ? 'border-red-900/30' : 'border-emerald-500/10'}`}>
                        <span className={`text-sm font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-200'}`}>{item.name} × {item.quantity}</span>
                        <span className={`text-sm font-bold ${isCancelled ? 'text-gray-500' : 'text-amber-400'}`}>Ksh {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`flex justify-between items-center pt-3 border-t font-bold ${isCancelled ? 'border-red-900/30' : 'border-emerald-500/10'}`}>
                    <span className="text-gray-500 text-sm">Total Revenue</span>
                    <span className={`text-xl font-serif ${isCancelled ? 'text-gray-500 line-through' : 'text-amber-400'}`}>Ksh {order.total_price}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {orders.length === 0 && (
            <div className="text-center py-20 bg-[#121A16] border border-emerald-500/20 rounded-2xl">
              <p className="text-gray-400">No incoming customer orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
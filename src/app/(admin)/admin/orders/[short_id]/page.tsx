import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Phone, User, Calendar } from 'lucide-react';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ short_id: string }>;
}) {
  const resolvedParams = await params;
  const shortId = resolvedParams.short_id;

  // 1. Fetch the main order details
  const orders = await sql`SELECT * FROM Orders WHERE short_id = ${shortId}`;
  
  if (orders.length === 0) {
    notFound();
  }
  
  const order = orders[0];

  // 2. Fetch the specific fragrances bought in this order by joining Order_Items and Products
  const items = await sql`
    SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url, p.category 
    FROM Order_Items oi
    JOIN Products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ${order.order_id}
  `;

  // Server Action: Update Status
  async function updateStatus(formData: FormData) {
    'use server';
    const newStatus = formData.get('delivery_status') as string;
    await sql`UPDATE Orders SET delivery_status = ${newStatus} WHERE order_id = ${order.order_id}`;
    
    // Refresh this page and the main table
    revalidatePath(`/admin/orders/${shortId}`);
    revalidatePath('/admin/orders');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#060908] text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to All Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-emerald-600 dark:text-emerald-400">Order #{order.short_id}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage packing and delivery status</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-block text-center ${
            order.payment_status === 'Paid' 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
          }`}>
            M-Pesa: {order.payment_status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Customer & Action Panel */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Status Updater */}
            <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Delivery Status</h2>
              <form action={updateStatus} className="space-y-4">
                <select 
                  name="delivery_status" 
                  defaultValue={order.delivery_status || 'Processing'}
                  className="w-full bg-white dark:bg-black border border-emerald-500/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="Processing">📦 Processing</option>
                  <option value="Dispatched">🚚 Dispatched</option>
                  <option value="Delivered">✅ Delivered</option>
                </select>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-md cursor-pointer"
                >
                  Update Progress
                </button>
              </form>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Customer Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">Name</p>
                    <p className="text-sm font-bold">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">Phone</p>
                    <p className="text-sm font-bold">{order.customer_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase text-gray-500">Delivery Location</p>
                    <p className="text-sm font-bold">{order.location}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Items to Pack */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-2xl p-6 shadow-xl h-full">
              <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-4 mb-4">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Items to Pack</h2>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white dark:bg-black/50 border border-emerald-500/10 p-3 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-emerald-500/20 flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="object-contain w-full h-full p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-emerald-600 font-bold uppercase">Nova</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{item.category}</p>
                      <h3 className="font-serif text-sm md:text-base text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-bold text-gray-900 dark:text-white">{item.quantity}</span></p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Ksh {(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-500/10 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-500">Total Paid</span>
                <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">Ksh {Number(order.total_price).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
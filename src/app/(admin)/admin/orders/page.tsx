import { sql } from '@/lib/db';
import Link from 'next/link';
import { Eye, MessageCircle, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminOrdersPage() {
  async function deleteOrder(formData: FormData) {
    'use server';
    const orderId = formData.get('orderId') as string;
    
    if (orderId) {
      await sql`DELETE FROM Order_Items WHERE order_id = ${orderId}`;
      await sql`DELETE FROM Orders WHERE order_id = ${orderId}`;
      revalidatePath('/admin/orders');
    }
  }

  const orders = await sql`
    SELECT * FROM Orders 
    ORDER BY order_id DESC
  `;

  return (
    <div className="min-h-screen bg-white dark:bg-[#060908] text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif mb-8 text-emerald-600 dark:text-emerald-400">Logistics & Dispatch</h1>
        
        <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-3xl p-6 shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-emerald-500/20 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Customer Details</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const displayId = order.short_id || order.order_id.substring(0, 8).toUpperCase();
                const routeId = order.short_id || order.order_id;
                
                // Smart WhatsApp Number Formatter
                let waNumber = order.customer_phone?.replace(/[^0-9]/g, '') || '';
                if (waNumber.startsWith('0')) {
                  waNumber = '254' + waNumber.substring(1);
                } else if (waNumber.length === 9) {
                  waNumber = '254' + waNumber;
                }

                const waMessage = encodeURIComponent(`Hi ${order.customer_name}, thank you for your order with Nova Fragrances Nbo! ✨ Are you ready to arrange delivery to ${order.location}?`);

                return (
                  <tr key={order.order_id} className="border-b border-emerald-500/10 hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    
                    <td className="p-3 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      #{displayId}
                    </td>
                    
                    <td className="p-3">
                      <div className="text-sm font-bold">{order.customer_name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{order.location}</div>
                    </td>
                    
                    <td className="p-3 text-sm font-bold text-amber-600 dark:text-amber-400">
                      Ksh {Number(order.total_price).toLocaleString()}
                    </td>
                    
                    <td className="p-3">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'Paid' || order.payment_status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          Pay: {order.payment_status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          Box: {order.delivery_status || 'Processing'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {order.payment_status === 'Pending Payment' && waNumber && (
                          <a 
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                        )}

                        <Link 
                          href={`/admin/orders/${routeId}`}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Link>

                        <form action={deleteOrder}>
                          <input type="hidden" name="orderId" value={order.order_id} />
                          <button 
                            type="submit"
                            className="inline-flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 p-2 rounded-xl transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>

                      </div>
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No trackable orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
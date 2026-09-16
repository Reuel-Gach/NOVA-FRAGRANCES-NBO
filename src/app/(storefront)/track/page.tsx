import { sql } from '@/lib/db';
import { Search, Package, Truck, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawId = resolvedParams.id;
  
  // Clean the input (allows the customer to search with or without the '#')
  const trackId = rawId ? rawId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : null;

  let order = null;
  let error = null;

  if (trackId) {
    // We added order_id here so we can link them to their full receipt
    const result = await sql`
      SELECT order_id, short_id, delivery_status, customer_name, location 
      FROM Orders 
      WHERE short_id = ${trackId}
    `;
    if (result.length > 0) {
      order = result[0];
    } else {
      error = "We couldn't find an order with that tracking ID. Please check and try again.";
    }
  }

  // Helper to determine the visual state of the timeline
  const getStepState = (currentStatus: string, stepName: string) => {
    const stages = ['Processing', 'Dispatched', 'Delivered'];
    const currentIndex = stages.indexOf(currentStatus || 'Processing');
    const stepIndex = stages.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 bg-white dark:bg-[#060908] text-gray-900 dark:text-white transition-colors duration-300">
      
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-serif mb-3 tracking-tight">Track Your Scent</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Enter the tracking ID provided during checkout to view your delivery status.</p>
        </div>

        {/* Search Form */}
        <form className="relative flex items-center w-full max-w-md mx-auto mb-12">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            name="id" 
            defaultValue={rawId || ''}
            placeholder="e.g. #D0932648" 
            className="w-full bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/30 rounded-2xl py-4 pl-12 pr-32 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-gray-900 dark:text-white"
            required
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-bold uppercase tracking-widest text-[10px] px-6 rounded-xl transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center text-sm font-bold shadow-sm">
            {error}
          </div>
        )}

        {/* Tracking Timeline Component */}
        {order && (
          <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-3xl p-6 md:p-10 shadow-xl dark:shadow-2xl">
            <div className="flex justify-between items-end border-b border-emerald-500/10 pb-6 mb-8">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Order Details</p>
                <h2 className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">#{order.short_id}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{order.customer_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.location}</p>
              </div>
            </div>

            {/* The Visual Timeline */}
            <div className="relative flex justify-between items-center px-4 md:px-12">
              {/* Background connecting line */}
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0 rounded-full"></div>
              
              {/* Active connecting line */}
              <div 
                className="absolute top-1/2 left-8 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-1000 rounded-full"
                style={{ 
                  width: order.delivery_status === 'Delivered' ? 'calc(100% - 4rem)' : 
                         order.delivery_status === 'Dispatched' ? '50%' : '0%' 
                }}
              ></div>

              {/* Step 1: Processing */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  getStepState(order.delivery_status, 'Processing') !== 'pending' 
                    ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-black' 
                    : 'bg-white border-gray-300 text-gray-400 dark:bg-black dark:border-gray-700'
                }`}>
                  <Package className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getStepState(order.delivery_status, 'Processing') !== 'pending' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>Processing</span>
              </div>

              {/* Step 2: Dispatched */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  getStepState(order.delivery_status, 'Dispatched') === 'completed' || getStepState(order.delivery_status, 'Dispatched') === 'active'
                    ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-black' 
                    : 'bg-white border-gray-300 text-gray-400 dark:bg-black dark:border-gray-700'
                }`}>
                  <Truck className={`w-5 h-5 ${getStepState(order.delivery_status, 'Dispatched') === 'active' ? 'animate-bounce' : ''}`} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getStepState(order.delivery_status, 'Dispatched') !== 'pending' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>Dispatched</span>
              </div>

              {/* Step 3: Delivered */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  getStepState(order.delivery_status, 'Delivered') === 'active' 
                    ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-black' 
                    : 'bg-white border-gray-300 text-gray-400 dark:bg-black dark:border-gray-700'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getStepState(order.delivery_status, 'Delivered') === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>Delivered</span>
              </div>
            </div>
            
            {/* Action Links */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={`/order/${order.order_id}/success`}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white dark:bg-[#121A16] hover:bg-gray-100 dark:hover:bg-[#1A2620] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest py-3 px-6 rounded-xl transition-all text-xs shadow-sm"
              >
                <FileText className="w-4 h-4" /> View Full Receipt
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-emerald-500 underline transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
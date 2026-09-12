'use client'

import { XCircle } from 'lucide-react';
import { updateOrderStatus, cancelOrder } from './actions';

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const isCompleted = currentStatus === 'Completed';

  const handleToggleStatus = async () => {
    const nextStatus = isCompleted ? 'Pending' : 'Completed';
    await updateOrderStatus(orderId, nextStatus);
  };

  const handleCancel = async () => {
    // Safely runs only in the browser
    if (window.confirm("Cancel this order and return items to stock?")) {
      await cancelOrder(orderId);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <button 
        onClick={handleToggleStatus} 
        className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
      >
        {isCompleted ? 'Mark Pending' : 'Complete'}
      </button>

      <button 
        onClick={handleCancel} 
        className="flex items-center justify-center gap-1 w-full md:w-auto bg-transparent hover:bg-red-950/40 text-red-400 border border-red-900/50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
      >
        <XCircle className="w-4 h-4" /> Cancel
      </button>
    </div>
  );
}
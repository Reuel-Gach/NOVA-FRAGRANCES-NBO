import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import POSClient from './POSClient';

export default async function POSPage() {
  const products = await sql`SELECT * FROM Products WHERE stock_quantity > 0 ORDER BY name ASC`;

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold tracking-widest uppercase text-emerald-400">
            Point of Sale (POS)
          </span>
        </div>
        <UserButton />
      </nav>

      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-white">Direct Checkout Till</h1>
        <p className="text-gray-400 mb-8">Quickly log offline, WhatsApp, or walk-in sales to keep inventory synced.</p>

        <POSClient products={products} />
      </div>
    </div>
  );
}
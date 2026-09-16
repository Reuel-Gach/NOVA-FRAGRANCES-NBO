import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import AdminProductList from './AdminProductList';
import AddProductForm from './AddProductForm';

export default async function AdminDashboard() {
  const products = await sql`SELECT * FROM Products ORDER BY name ASC`;

  return (
    <div className="min-h-screen bg-white dark:bg-[#060908] text-gray-900 dark:text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black transition-colors duration-300">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
          Nova Admin Portal
        </span>
        <UserButton />
      </nav>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-gray-900 dark:text-white">Inventory Management</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-xs md:text-sm">Add new stock, modify existing prices, or manage active listings.</p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link href="/admin/orders" className="flex justify-center items-center gap-2 bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-black transition-all shadow-md text-sm text-center">
            Live Order Queue ➔
          </Link>
          <Link href="/admin/pos" className="flex justify-center items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-black transition-all shadow-md text-sm text-center">
            Open POS Till ➔
          </Link>
          <Link href="/admin/metrics" className="flex justify-center items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-md text-sm text-center">
            View Analytics ➔
          </Link>
        </div>

        {/* Main Grid: Add Form & Current Inventory List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Add Product Form Component */}
          <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider">Add New Fragrance</h2>
            <AddProductForm />
          </div>

          {/* Active Inventory List */}
          <div className="bg-gray-50 dark:bg-[#0E1512] border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-xl transition-colors">
            <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider">Current Shelf Catalog</h2>
            <AdminProductList products={products} />
          </div>

        </div>
      </div>
    </div>
  );
}
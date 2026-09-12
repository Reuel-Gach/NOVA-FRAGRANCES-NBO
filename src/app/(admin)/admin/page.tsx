import { sql } from '@/lib/db';
import { addProduct } from './actions';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import AdminProductList from './AdminProductList';

export default async function AdminDashboard() {
  const products = await sql`SELECT * FROM Products ORDER BY name ASC`;

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-widest uppercase text-emerald-400">
          Nova Admin Portal
        </span>
        <UserButton />
      </nav>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-white">Inventory Management</h1>
        <p className="text-gray-400 mb-8">Add new stock, modify existing prices, or manage active listings.</p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link href="/admin/orders" className="flex justify-center items-center gap-2 bg-[#121A16] border border-emerald-500/30 text-emerald-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all shadow-lg text-sm text-center">
            Live Order Queue ➔
          </Link>
          <Link href="/admin/pos" className="flex justify-center items-center gap-2 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all shadow-lg text-sm text-center">
            Open POS Till ➔
          </Link>
          <Link href="/admin/metrics" className="flex justify-center items-center gap-2 bg-amber-950/20 border border-amber-500/30 text-amber-400 px-4 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-amber-400 hover:text-black transition-all shadow-lg text-sm text-center">
            View Analytics ➔
          </Link>
        </div>

        {/* Main Grid: Add Form & Current Inventory List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Add Product Form */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider">Add New Fragrance</h2>
            
            <form action={addProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Barcode / Product ID</label>
                <input 
                  type="text" 
                  name="product_id" 
                  placeholder="e.g. 6975962061571" 
                  required 
                  className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Perfume Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="e.g. Tom Ford Oud Wood" 
                    required 
                    className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    name="category" 
                    className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="Masculine">Masculine</option>
                    <option value="Feminine">Feminine</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (Ksh)</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="3500" 
                    required 
                    className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stock_quantity" 
                    placeholder="10" 
                    required 
                    className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL (UploadThing)</label>
                <input 
                  type="url" 
                  name="image_url" 
                  placeholder="Paste image URL here" 
                  className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Scent Profile / Description</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  placeholder="Woody, smoky, rich amber notes..." 
                  className="w-full bg-black border border-emerald-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm placeholder:text-gray-600"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 text-black font-extrabold uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm"
              >
                Publish Fragrance
              </button>
            </form>
          </div>

          {/* Active Inventory List */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-emerald-400 mb-6 uppercase tracking-wider">Current Shelf Catalog</h2>
            <AdminProductList products={products} />
          </div>

        </div>
      </div>
    </div>
  );
}
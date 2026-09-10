'use client'

import { addProduct } from './actions';
import { PackagePlus } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { UploadButton } from '@/utils/uploadthing';
import { useState } from 'react';
import "@uploadthing/react/styles.css";

export default function AdminDashboard() {
  const [imageUrl, setImageUrl] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#090D0B] text-white selection:bg-emerald-500 selection:text-black pb-12">
      {/* Navigation Bar matching the Storefront */}
      <nav className="border-b border-emerald-500/20 p-4 sticky top-0 bg-[#090D0B]/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-widest uppercase text-emerald-400">
            Nova Admin
          </span>
          <UserButton />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4 md:p-8 mt-4 md:mt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight mb-2 text-white">
              Banice's Command Center
            </h1>
            <p className="text-gray-400 font-medium">Manage inventory and log new fragrances.</p>
          </div>
          <div className="bg-[#121A16] p-3 rounded-full border border-emerald-500/30">
            <PackagePlus className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* High-Contrast Dark Form Container */}
        <form action={addProduct} className="space-y-6 bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 md:p-10 shadow-2xl">
          <input type="hidden" name="image_url" value={imageUrl} />

          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Barcode / Product ID</label>
            <input required type="text" name="product_id" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="e.g., 0123456789" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Perfume Name</label>
              <input required type="text" name="name" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="e.g., Bleu de Chanel" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Category</label>
              <select required name="category" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                <option value="Masculine" className="bg-black text-white">Masculine</option>
                <option value="Feminine" className="bg-black text-white">Feminine</option>
                <option value="Unisex" className="bg-black text-white">Unisex</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Description</label>
            <textarea required name="description" rows={3} className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none placeholder:text-gray-600" placeholder="Describe the scent notes..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Price (Ksh)</label>
              <input required type="number" step="0.01" name="price" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="2500.00" />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase">Stock Quantity</label>
              <input required type="number" name="stock_quantity" className="w-full rounded-xl bg-black border border-emerald-500/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-600" placeholder="10" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold tracking-widest text-emerald-400 uppercase mb-2">Product Image</label>
            <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-8 flex flex-col items-center justify-center bg-black hover:bg-emerald-950/20 transition-colors">
              {imageUrl ? (
                <div className="flex flex-col items-center">
                  <img src={imageUrl} alt="Uploaded preview" className="h-40 object-contain mb-4 rounded shadow-sm border border-emerald-500/30" />
                  <button type="button" onClick={() => setImageUrl('')} className="text-xs font-bold text-red-400 hover:text-red-300 tracking-widest uppercase transition-colors">Remove Image</button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button: "bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-colors rounded-full px-6 py-2 tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)]",
                    allowedContent: "text-gray-400 mt-2 text-xs font-medium"
                  }}
                  onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                      setImageUrl(res[0].url);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                />
              )}
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-black font-extrabold tracking-widest uppercase py-4 px-4 rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all mt-8 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            Save Perfume
          </button>
        </form>
      </main>
    </div>
  );
}
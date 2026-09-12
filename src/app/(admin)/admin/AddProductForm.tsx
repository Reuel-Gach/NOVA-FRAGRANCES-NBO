'use client'

import { useState } from 'react';
import { addProduct } from './actions';
import { UploadButton } from '@/utils/uploadthing';
import { Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddProductForm() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <form action={addProduct} className="space-y-4">
      <input type="hidden" name="image_url" value={imageUrl} />

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

      {/* UploadThing Image Upload & Live Preview */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Image</label>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-black p-4 rounded-2xl border border-emerald-500/20">
          <div className="w-20 h-20 bg-[#121A16] rounded-xl border border-emerald-500/30 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
            {imageUrl ? (
              <img src={imageUrl} alt="Product Preview" className="object-contain w-full h-full p-1" />
            ) : (
              <ImageIcon className="w-7 h-7 text-emerald-600" />
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="text-xs text-gray-400">Upload studio photo via UploadThing.</p>
            <UploadButton
              endpoint="imageUploader"
              appearance={{
                button: "bg-emerald-500 text-black font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer",
                allowedContent: "text-gray-500 text-[10px] mt-1"
              }}
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  const newUrl = res[0].ufsUrl || res[0].url;
                  setImageUrl(newUrl);
                  toast.success('Image uploaded successfully!', {
                    style: { background: '#121A16', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
                  });
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload error: ${error.message}`);
              }}
            />
          </div>
        </div>
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
        className="w-full bg-emerald-500 text-black font-extrabold uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm cursor-pointer"
      >
        Publish Fragrance
      </button>
    </form>
  );
}
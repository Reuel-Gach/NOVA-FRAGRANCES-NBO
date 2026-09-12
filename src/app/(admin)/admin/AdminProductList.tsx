'use client'

import { deleteProduct } from './actions';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminProductList({ products }: { products: any[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}"? If it has past orders, it will be safely archived (stock set to 0).`)) return;

    try {
      await deleteProduct(id);
      toast.success('Product updated/removed successfully!', {
        style: { background: '#121A16', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
      });
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete product.');
    }
  };

  if (products.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-6">No products added yet.</p>;
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {products.map((product) => (
        <div key={product.product_id} className="flex items-center justify-between bg-black/50 border border-emerald-500/10 p-3 rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-contain w-full h-full p-1" />
              ) : (
                <span className="text-xs text-emerald-600 font-bold">Nova</span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm text-white line-clamp-1">{product.name}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span className="text-amber-400 font-bold">Ksh {product.price}</span>
                <span>•</span>
                <span className="text-emerald-400">Stock: {product.stock_quantity}</span>
                <span>•</span>
                <span className="uppercase text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-400">{product.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href={`/admin/products/${product.product_id}/edit`}
              className="p-2 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-500 hover:text-black rounded-lg transition-all border border-emerald-500/20"
              title="Edit Product"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => handleDelete(product.product_id, product.name)}
              className="p-2 bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-black rounded-lg transition-all border border-red-500/20"
              title="Delete / Archive Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
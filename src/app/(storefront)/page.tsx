import { sql } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';

export default async function StorefrontPage() {
  // Fetch available products directly from the database
  const products = await sql`SELECT * FROM Products WHERE stock_quantity > 0 ORDER BY name ASC`;

  return (
    <main className="min-h-screen bg-[#090D0B] text-white p-4 md:p-10 selection:bg-emerald-500 selection:text-black">
      {/* Hero Section */}
      <div className="text-center mb-16 mt-8">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4 tracking-tight">
          Find Your Signature Scent
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Discover our curated collection of premium fragrances.
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.product_id} className="flex flex-col bg-[#121A16] border border-emerald-500/20 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300">
            
            {/* Image Area */}
            <div className="aspect-square bg-black relative flex items-center justify-center p-4 border-b border-emerald-500/10">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-cover w-full h-full rounded-xl" />
              ) : (
                <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm border border-emerald-500/30 px-4 py-2 rounded-lg bg-emerald-950/40">Nova</span>
              )}
            </div>
            
            {/* Product Details */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                {product.category}
              </div>
              <h2 className="text-lg font-bold text-white mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-grow">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto border-t border-emerald-500/10 pt-4">
                <span className="font-bold text-lg text-amber-400">
                  Ksh {product.price}
                </span>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback if no products exist */}
      {products.length === 0 && (
        <div className="max-w-md mx-auto text-center text-gray-400 mt-20 p-10 bg-[#121A16] border border-emerald-500/20 rounded-2xl shadow-xl">
          No perfumes available right now. Check back later!
        </div>
      )}
    </main>
  );
}
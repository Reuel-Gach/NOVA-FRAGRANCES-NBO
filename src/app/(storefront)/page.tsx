import { sql } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';
import { ShieldCheck, Zap } from 'lucide-react';

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;

  // Dynamically fetch products based on the selected category
  let products;
  if (category) {
    products = await sql`SELECT * FROM Products WHERE stock_quantity > 0 AND category = ${category} ORDER BY name ASC`;
  } else {
    products = await sql`SELECT * FROM Products WHERE stock_quantity > 0 ORDER BY name ASC`;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#060908] text-gray-900 dark:text-white p-3 md:p-8 selection:bg-emerald-500 selection:text-black transition-colors duration-300">
      
      {/* Local Trust & Dispatch Header Banner */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-sm dark:shadow-[0_4px_20px_rgba(4,120,87,0.1)] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
              Ready for Fast Dispatch in <span className="text-emerald-600 dark:text-emerald-400">Kiambu & Nairobi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Immersive Cinematic Hero Section */}
      <div className="max-w-[1400px] mx-auto mb-10 relative overflow-hidden rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 dark:bg-gradient-to-r dark:from-emerald-950/50 dark:to-emerald-900/10 border border-emerald-500/30 p-6 md:p-12 shadow-md dark:shadow-[0_8px_30px_rgba(4,120,87,0.15)] transition-colors">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            Flagship Curation • Live Stock
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white mb-3 tracking-tight">
            {category ? `${category} Collection` : 'The Art of Signature Scent'}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed mb-6">
            Bottled authenticity, hand-curated and dispatched straight from our shelves in Kiambu & Nairobi. Experience notes designed to linger.
          </p>
          {category && (
            <Link href="/" className="inline-block text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 uppercase tracking-widest transition-colors bg-white dark:bg-black/60 border border-emerald-500/30 px-5 py-2.5 rounded-xl shadow">
              ← View All Scents
            </Link>
          )}
        </div>
      </div>

      {/* Product Grid Featuring Studio-Frames & Clean In Stock Badges */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
        {products.map((product) => {
          return (
            <div 
              key={product.product_id} 
              className="flex flex-col bg-white dark:bg-[#0E1512] border border-emerald-500/15 rounded-2xl hover:shadow-[0_8px_25px_rgba(16,185,129,0.12)] hover:border-emerald-500/40 transition-all duration-300 overflow-hidden group p-3 md:p-4 relative shadow-sm"
            >
              
              {/* Clean In Stock Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  In Stock
                </span>
              </div>

              {/* The "Studio-Frame" Image Container */}
              <Link href={`/product/${product.product_id}`} className="flex flex-col flex-grow">
                <div className="aspect-square bg-gray-50 dark:bg-gradient-to-b dark:from-[#141F1A] dark:to-[#0A100D] rounded-xl relative flex items-center justify-center overflow-hidden mb-3 border border-emerald-500/10 group-hover:border-emerald-500/30 transition-all shadow-inner">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="object-contain w-full h-full p-3 group-hover:scale-108 transition-transform duration-500" 
                    />
                  ) : (
                    <span className="text-emerald-600 font-bold tracking-widest uppercase text-[10px]">Nova</span>
                  )}
                </div>
                
                {/* Mobile-First Editorial Typography */}
                <div className="flex flex-col flex-grow mb-3">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">
                    {product.category}
                  </span>
                  <h2 className="text-xs md:text-sm font-serif text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {product.name}
                  </h2>
                </div>
              </Link>
              
              {/* Distinct Price & Action Card Panel */}
              <div className="mt-auto bg-gray-50 dark:bg-black/60 border border-emerald-500/20 p-3 rounded-xl shadow-inner">
                <div className="font-bold text-sm md:text-base text-amber-600 dark:text-amber-400 mb-2.5">
                  Ksh {Number(product.price).toLocaleString()}
                </div>
                
                <div className="w-full">
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fallback if no products match */}
      {products.length === 0 && (
        <div className="max-w-md mx-auto text-center text-gray-500 dark:text-gray-400 mt-16 p-8 bg-white dark:bg-[#0E1512] border border-emerald-500/20 rounded-2xl text-sm shadow-xl">
          <p className="text-base font-serif text-gray-900 dark:text-white mb-2">No fragrances found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">There are no items currently available in the {category?.toLowerCase()} collection. Check back soon!</p>
        </div>
      )}
    </main>
  );
}
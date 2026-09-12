import { sql } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  // Await the searchParams promise before accessing the category
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
    <main className="min-h-screen bg-[#090D0B] text-white p-2 md:p-6 selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Hero Section */}
      <div className="text-center mb-6 mt-2">
        <h1 className="text-xl md:text-3xl font-serif text-white mb-2 tracking-tight">
          {category ? `${category} Fragrances` : 'Signature Scents'}
        </h1>
        {category && (
          <Link href="/" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">
            ← View All Scents
          </Link>
        )}
      </div>

      {/* Jumia-Style Compact Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {products.map((product) => (
          <div key={product.product_id} className="flex flex-col bg-[#121A16] border border-emerald-500/10 rounded-lg hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-200 overflow-hidden group p-2 md:p-3">
            
            {/* Image Area */}
            <div className="aspect-square bg-white rounded-md relative flex items-center justify-center overflow-hidden mb-2 md:mb-3">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-contain w-full h-full p-2" />
              ) : (
                <span className="text-emerald-600 font-bold tracking-widest uppercase text-[10px]">Nova</span>
              )}
            </div>
            
            {/* Compact Details */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-xs md:text-sm font-medium text-gray-200 line-clamp-2 leading-snug mb-1 group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h2>
              
              <span className="font-bold text-sm md:text-base text-amber-400 mb-2">
                Ksh {product.price}
              </span>
              
              <div className="mt-auto w-full">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback if no products exist in that category */}
      {products.length === 0 && (
        <div className="max-w-md mx-auto text-center text-gray-400 mt-12 p-6 bg-[#121A16] border border-emerald-500/10 rounded-lg text-sm">
          No {category?.toLowerCase()} perfumes available right now. Check back later!
        </div>
      )}
    </main>
  );
}
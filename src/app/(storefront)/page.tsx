import { sql } from '@/lib/db';

export default async function StorefrontPage() {
  // Fetch available products directly from the database
  const products = await sql`SELECT * FROM Products WHERE stock_quantity > 0 ORDER BY name ASC`;

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">
          Find Your Signature Scent
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Discover our curated collection of premium fragrances.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.product_id} className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            
            {/* Image Area */}
            <div className="aspect-square bg-gray-50 relative flex items-center justify-center p-4">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="object-cover w-full h-full rounded-md shadow-sm" />
              ) : (
                <span className="text-gray-400 font-medium tracking-widest uppercase text-sm">Nova</span>
              )}
            </div>
            
            {/* Product Details */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                {product.category}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
                <span className="font-bold text-lg text-gray-900">
                  Ksh {product.price}
                </span>
                <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback if no products exist */}
      {products.length === 0 && (
        <div className="text-center text-gray-400 mt-20 p-10 border border-dashed rounded-xl">
          No perfumes available right now. Check back later!
        </div>
      )}
    </main>
  );
}
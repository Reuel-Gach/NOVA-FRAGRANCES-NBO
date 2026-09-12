import { sql } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const products = await sql`
    SELECT * FROM Products WHERE product_id = ${productId}
  `;

  if (products.length === 0) {
    notFound();
  }

  const product = products[0];

  // WhatsApp pre-filled consultation link
  const whatsappMessage = encodeURIComponent(
    `Hi Banice, I am looking at ${product.name} (Ksh ${product.price}) on Nova Fragrances. Could you tell me more about its scent profile?`
  );
  const whatsappUrl = `https://wa.me/254106935284?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation Back */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors bg-[#121A16] border border-emerald-500/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>
      </div>

      {/* Main Product Container */}
      <div className="max-w-5xl mx-auto bg-[#121A16] border border-emerald-500/20 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
        {/* Left: Studio-Framed Image */}
        <div className="aspect-square bg-black/60 rounded-2xl border border-emerald-500/10 relative flex items-center justify-center overflow-hidden group shadow-inner">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs">Nova Fragrances</span>
          )}
          <div className="absolute top-4 left-4 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{product.category}</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-2xl md:text-4xl font-serif text-white mb-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-amber-400">
              Ksh {Number(product.price).toLocaleString()}
            </p>
          </div>

          {/* Stock Status Badge */}
          <div className="mb-6 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {product.stock_quantity > 0 ? `${product.stock_quantity} bottles available in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Banice's Description / Scent Notes */}
          <div className="mb-8 bg-black/40 border border-emerald-500/10 p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Scent Profile & Details</h3>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {product.description || 'A signature artisanal fragrance curated exclusively by Nova Fragrances.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            {product.stock_quantity > 0 ? (
              <div className="w-full">
                <AddToCartButton product={product} />
              </div>
            ) : (
              <button disabled className="w-full bg-gray-800 text-gray-500 font-bold uppercase tracking-widest py-3 rounded-xl cursor-not-allowed">
                Currently Out of Stock
              </button>
            )}

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-emerald-900/40 transition-all text-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" /> Ask Banice on WhatsApp
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-emerald-500/10 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>100% Authentic Bottling</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Fast Local Dispatch</span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
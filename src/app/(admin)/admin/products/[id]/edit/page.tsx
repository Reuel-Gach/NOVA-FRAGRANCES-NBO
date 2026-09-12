import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const products = await sql`SELECT * FROM Products WHERE product_id = ${resolvedParams.id}`;

  if (products.length === 0) {
    notFound();
  }

  const product = products[0];

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold tracking-widest uppercase text-emerald-400">
            Edit Fragrance
          </span>
        </div>
        <UserButton />
      </nav>

      <div className="max-w-3xl mx-auto bg-[#121A16] border border-emerald-500/20 rounded-3xl p-6 md:p-10 shadow-xl">
        <h1 className="text-2xl font-serif mb-6 text-white">Modify Product Details</h1>
        <EditProductForm product={product} />
      </div>
    </div>
  );
}
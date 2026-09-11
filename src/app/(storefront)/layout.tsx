import { ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';
import CartIndicator from '@/components/CartIndicator';
import { Toaster } from 'react-hot-toast';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090D0B] text-white selection:bg-emerald-500 selection:text-black">
      <Toaster position="top-center"/>
      {/* Navigation Bar */}
      <nav className="border-b border-emerald-500/20 p-4 sticky top-0 bg-[#090D0B]/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-widest uppercase text-emerald-400">
            Nova Fragrances
          </Link>
          
          {/* Category Navigation */}
          <div className="flex gap-6 text-sm font-medium text-gray-400 uppercase tracking-wide">
            <Link href="/?category=Masculine" className="hover:text-emerald-400 transition-colors">Masculine</Link>
            <Link href="/?category=Feminine" className="hover:text-emerald-400 transition-colors">Feminine</Link>
            <Link href="/?category=Unisex" className="hover:text-emerald-400 transition-colors">Unisex</Link>
          </div>

          <div className="flex items-center gap-5">
            <Show when="signed-in">
              <UserButton />
            </Show>
            
            <Show when="signed-out">
              <Link href="/sign-in" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </Show>

            {/* Cart Indicator */}
            <CartIndicator />
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      {children}
    </div>
  );
}
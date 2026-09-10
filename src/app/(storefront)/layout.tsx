import { ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-100 p-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          {/* Added text-gray-900 for high contrast */}
          <Link href="/" className="text-xl font-bold tracking-widest uppercase text-gray-900">
            Nova Fragrances
          </Link>
          
          <div className="flex items-center gap-5">
            <Show when="signed-in">
              <UserButton />
            </Show>
            
            <Show when="signed-out">
              <Link href="/sign-in" className="text-gray-600 hover:text-black">
                <User className="w-5 h-5" />
              </Link>
            </Show>

            {/* Cart Button */}
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-black">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-full">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      {children}
    </div>
  );
}
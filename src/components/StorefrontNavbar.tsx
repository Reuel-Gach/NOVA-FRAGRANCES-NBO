'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { Show, UserButton } from '@clerk/nextjs';
import CartButton from '@/components/CartButton';
import ThemeToggle from '@/components/ThemeToggle';

export default function StorefrontNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-emerald-500/20 px-4 py-4 sticky top-0 bg-white/90 dark:bg-[#090D0B]/90 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
          Nova Fragrances
        </Link>

        {/* Desktop Categories */}
        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
          <Link href="/?category=Masculine" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Masculine</Link>
          <Link href="/?category=Feminine" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Feminine</Link>
          <Link href="/?category=Unisex" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Unisex</Link>
        </div>

        {/* Right Actions: Theme Toggle, Auth, Cart, & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Show when="signed-in">
            <UserButton />
          </Show>
          
          <Show when="signed-out">
            <Link href="/sign-in" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1">
              <User className="w-5 h-5" />
            </Link>
          </Show>

          <CartButton />

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-emerald-500/20 flex flex-col gap-2 text-center pb-2">
          <Link 
            href="/?category=Masculine" 
            onClick={() => setIsOpen(false)}
            className="py-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
          >
            Masculine
          </Link>
          <Link 
            href="/?category=Feminine" 
            onClick={() => setIsOpen(false)}
            className="py-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
          >
            Feminine
          </Link>
          <Link 
            href="/?category=Unisex" 
            onClick={() => setIsOpen(false)}
            className="py-3 text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors"
          >
            Unisex
          </Link>
        </div>
      )}
    </nav>
  );
}
'use client'

import { MessageCircle } from 'lucide-react';

export default function WhatsAppBridge() {
  const phoneNumber = "254700000000"; // Replace with Banice's actual business WhatsApp number
  const message = encodeURIComponent("Hi Banice, I'm browsing Nova Fragrances and need help choosing a scent profile.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-500 text-black px-4 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-105 transition-all duration-300 group"
      aria-label="Chat with Banice on WhatsApp"
    >
      <div className="bg-black/10 p-1 rounded-full group-hover:rotate-12 transition-transform">
        <MessageCircle className="w-4 h-4 fill-black text-emerald-500" />
      </div>
      <span>Chat with Banice</span>
    </a>
  );
}
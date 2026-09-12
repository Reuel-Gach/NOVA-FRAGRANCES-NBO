import StorefrontNavbar from '@/components/StorefrontNavbar';
import { Toaster } from 'react-hot-toast';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090D0B] text-white selection:bg-emerald-500 selection:text-black">
      <Toaster position="top-center"/>
      <StorefrontNavbar />
      {children}
    </div>
  );
}
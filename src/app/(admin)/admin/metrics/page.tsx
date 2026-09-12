import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Package, Clock, BarChart3, Users } from 'lucide-react';

export default async function AnalyticsPage() {
  // 1. Calculate Total Revenue (Completed Orders Only)
  const revenueResult = await sql`
    SELECT SUM(total_price) as total_revenue 
    FROM Orders 
    WHERE payment_status = 'Completed'
  `;
  const totalRevenue = revenueResult[0]?.total_revenue || 0;

  // 2. Calculate Total Bottles Sold
  const bottlesResult = await sql`
    SELECT SUM(oi.quantity) as total_bottles
    FROM Order_Items oi
    JOIN Orders o ON oi.order_id = o.order_id
    WHERE o.payment_status = 'Completed'
  `;
  const totalBottles = bottlesResult[0]?.total_bottles || 0;

  // 3. Count Pending Web Orders
  const pendingResult = await sql`
    SELECT COUNT(*) as pending_count 
    FROM Orders 
    WHERE payment_status = 'Pending'
  `;
  const pendingOrders = pendingResult[0]?.pending_count || 0;

  // 4. Top 5 Best-Selling Perfumes
  const topSellers = await sql`
    SELECT p.name, p.category, SUM(oi.quantity) as total_sold
    FROM Order_Items oi
    JOIN Orders o ON oi.order_id = o.order_id
    JOIN Products p ON oi.product_id = p.product_id
    WHERE o.payment_status = 'Completed'
    GROUP BY p.product_id, p.name, p.category
    ORDER BY total_sold DESC
    LIMIT 5
  `;

// 5. Top 5 VIP Customers (Includes Web and named POS customers, excludes anonymous walk-ins)
  const topCustomers = await sql`
    SELECT o.customer_name, o.customer_phone, SUM(oi.quantity) as total_bought
    FROM Order_Items oi
    JOIN Orders o ON oi.order_id = o.order_id
    WHERE o.payment_status = 'Completed' 
      AND o.customer_name != 'Walk-in Sale'
    GROUP BY o.customer_name, o.customer_phone
    ORDER BY total_bought DESC
    LIMIT 5
  `;

  return (
    <div className="min-h-screen bg-[#090D0B] text-white p-4 md:p-8 selection:bg-emerald-500 selection:text-black">
      <nav className="border-b border-emerald-500/20 pb-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Performance Metrics
          </span>
        </div>
        <UserButton />
      </nav>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif mb-2 text-white">Business Overview</h1>
        <p className="text-gray-400 mb-8">Real-time revenue, fulfillment status, and customer performance.</p>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Revenue Card */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_#FBBF24]"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl"><TrendingUp className="w-6 h-6 text-amber-400" /></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Revenue</h2>
            </div>
            <p className="text-4xl font-serif text-amber-400">Ksh {Number(totalRevenue).toLocaleString()}</p>
          </div>

          {/* Bottles Sold Card */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_#10B981]"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl"><Package className="w-6 h-6 text-emerald-400" /></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Bottles Sold</h2>
            </div>
            <p className="text-4xl font-serif text-emerald-400">{totalBottles}</p>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_#EF4444]"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl"><Clock className="w-6 h-6 text-red-400" /></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Pending Actions</h2>
            </div>
            <p className="text-4xl font-serif text-red-400">{pendingOrders} Orders</p>
          </div>
        </div>

        {/* 2-Column Leaderboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Sellers Leaderboard */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-5 h-5" /> Top Fragrances
            </h2>
            
            {topSellers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No sales data yet.</p>
            ) : (
              <div className="space-y-4">
                {topSellers.map((product: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/50 border border-emerald-500/10 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-serif text-emerald-500/50">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-white">{product.name}</p>
                        <p className="text-[10px] text-emerald-400 uppercase tracking-widest">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400 text-lg">{product.total_sold}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Units Sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top VIP Customers Leaderboard */}
          <div className="bg-[#121A16] border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-amber-400 mb-6 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5" /> VIP Customers
            </h2>
            
            {topCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No web customer data yet.</p>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((customer: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-black/50 border border-amber-500/10 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-serif text-amber-500/50">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-white">{customer.customer_name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{customer.customer_phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-lg">{customer.total_bought}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Bottles</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
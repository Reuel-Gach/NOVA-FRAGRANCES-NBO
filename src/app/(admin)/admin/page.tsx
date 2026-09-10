import { addProduct } from './actions';
import { PackagePlus } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Banice's Command Center</h1>
      <UserButton />
    </header>

      <main className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <PackagePlus className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Add New Perfume</h2>
        </div>

        <form action={addProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode / Product ID</label>
            <input required type="text" name="product_id" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., 0123456789" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Perfume Name</label>
              <input required type="text" name="name" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Bleu de Chanel" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select required name="category" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500">
                <option value="Masculine">Masculine</option>
                <option value="Feminine">Feminine</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required name="description" rows={3} className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="Describe the scent notes..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (Ksh)</label>
              <input required type="number" step="0.01" name="price" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="2500.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input required type="number" name="stock_quantity" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="10" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (Optional for now)</label>
            <input type="url" name="image_url" className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" placeholder="https://..." />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Save Perfume
          </button>
        </form>
      </main>
    </div>
  );
}
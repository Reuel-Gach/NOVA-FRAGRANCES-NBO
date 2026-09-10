import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.product_id === newItem.product_id);
          if (existingItem) {
            // If item exists, increase quantity
            return {
              items: state.items.map((i) =>
                i.product_id === newItem.product_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          // If new item, add to cart with quantity 1
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { 
      name: 'nova-cart-storage', // The name used in localStorage
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  stock_quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product_id === product.product_id);

        if (existingItem) {
          // Increment quantity freely without stock caps
          set({
            items: currentItems.map((item) =>
              item.product_id === product.product_id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Add unique item with initial quantity 1
          set({
            items: [...currentItems, { ...product, quantity: 1 }]
          });
        }
      },
      removeItem: (product_id) => {
        set({ items: get().items.filter((item) => item.product_id !== product_id) });
      },
      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(product_id);
          return;
        }
        // Allow any quantity requested by the user
        set({
          items: get().items.map((item) =>
            item.product_id === product_id
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: 'nova-cart-storage' }
  )
);
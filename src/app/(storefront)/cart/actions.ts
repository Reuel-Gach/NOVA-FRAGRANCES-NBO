'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface OrderPayload {
  customerName: string;
  customerPhone: string;
  location: string;
  totalAmount: number;
  items: any[];
}

export async function processOrder(payload: OrderPayload): Promise<{ success: boolean; orderId: string }> {
  const { customerName, customerPhone, location, totalAmount, items } = payload;
  const orderId = crypto.randomUUID();

  try {
    // 1. Verify that all products still exist in the database before proceeding
    const productIds = items.map(item => item.product_id);
    
    // Fetch valid products from the DB
    const validProducts = await sql`
      SELECT product_id FROM Products WHERE product_id = ANY(${productIds})
    `;
    const validProductIds = validProducts.map(p => p.product_id);

    // 2. Filter out any items from the cart payload that no longer exist in the DB
    const validItemsToProcess = items.filter(item => validProductIds.includes(item.product_id));

    if (validItemsToProcess.length === 0) {
      throw new Error('All items in your cart are no longer available. Please refresh and try again.');
    }

    // 3. Recalculate total amount based only on valid items to prevent mismatch
    const finalTotalAmount = validItemsToProcess.reduce((total, item) => total + (item.price * item.quantity), 0);

    // 4. Create the Order
    await sql`
      INSERT INTO Orders (order_id, customer_name, customer_phone, location, total_price, payment_status, order_source)
      VALUES (${orderId}, ${customerName}, ${customerPhone}, ${location}, ${finalTotalAmount}, 'Pending', 'Web')
    `;

    // 5. Insert Order Items and Update Stock for valid items
    for (const item of validItemsToProcess) {
      await sql`
        INSERT INTO Order_Items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `;

      await sql`
        UPDATE Products 
        SET stock_quantity = stock_quantity - ${item.quantity}
        WHERE product_id = ${item.product_id}
      `;
    }

    revalidatePath('/');
    return { success: true, orderId };
  } catch (error) {
    console.error('Order processing error:', error);
    throw new Error('Failed to complete order.');
  }
}
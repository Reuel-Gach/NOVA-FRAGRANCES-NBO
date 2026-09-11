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

export async function processOrder(payload: OrderPayload) {
  const { customerName, customerPhone, location, totalAmount, items } = payload;
  
  // Generate a valid UUID v4 that PostgreSQL expects for uuid columns
  const orderId = crypto.randomUUID();

  try {
    // 1. Create the main order record
    await sql`
      INSERT INTO Orders (order_id, customer_name, customer_phone, location, total_price, payment_status, order_source)
      VALUES (${orderId}, ${customerName}, ${customerPhone}, ${location}, ${totalAmount}, 'Pending', 'Web')
    `;

    // 2. Log items and deduct stock
    for (const item of items) {
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
    return { success: true };
  } catch (error) {
    console.error('Order processing error:', error);
    throw new Error('Failed to complete order.');
  }
}
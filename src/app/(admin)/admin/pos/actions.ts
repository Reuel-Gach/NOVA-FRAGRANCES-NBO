'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function recordPOSSale(
  items: any[], 
  totalAmount: number, 
  customerName: string, 
  customerPhone: string
) {
  const orderId = crypto.randomUUID();
  
  // Set defaults if Banice leaves the fields blank
  const finalName = customerName.trim() || 'Walk-in Sale';
  const finalPhone = customerPhone.trim() || 'N/A';

  try {
    // Record with the provided customer details
    await sql`
      INSERT INTO Orders (order_id, customer_name, customer_phone, location, total_price, payment_status, order_source)
      VALUES (${orderId}, ${finalName}, ${finalPhone}, 'In-Store', ${totalAmount}, 'Completed', 'POS')
    `;

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

    revalidatePath('/admin/pos');
    revalidatePath('/admin/metrics');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('POS Error:', error);
    throw new Error('Failed to record POS sale');
  }
}
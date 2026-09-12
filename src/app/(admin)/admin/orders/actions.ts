'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await sql`
      UPDATE Orders 
      SET payment_status = ${status}
      WHERE order_id = ${orderId}
    `;
    revalidatePath('/admin/orders');
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Could not update order status.');
  }
}

export async function cancelOrder(orderId: string) {
  try {
    // 1. Fetch the items from this specific order
    const items = await sql`
      SELECT product_id, quantity 
      FROM Order_Items 
      WHERE order_id = ${orderId}
    `;

    // 2. Restore the stock for each item
    for (const item of items) {
      await sql`
        UPDATE Products 
        SET stock_quantity = stock_quantity + ${item.quantity}
        WHERE product_id = ${item.product_id}
      `;
    }

    // 3. Mark the order as Cancelled
    await sql`
      UPDATE Orders 
      SET payment_status = 'Cancelled'
      WHERE order_id = ${orderId}
    `;

    // Refresh both the admin queue and the public storefront
    revalidatePath('/admin/orders');
revalidatePath('/');
    // Return the generated UUID so the cart can redirect the customer
    return { success: true, orderId };
  } catch (error) {
    console.error('Failed to cancel order:', error);
    throw new Error('Could not cancel order and restore stock.');
  }
}
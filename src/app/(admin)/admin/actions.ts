'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock_quantity') as string, 10);
  const category = formData.get('category') as string;
  const imageUrl = formData.get('image_url') as string;

  try {
    await sql`
      INSERT INTO Products (product_id, name, description, price, stock_quantity, category, image_url)
      VALUES (${productId}, ${name}, ${description}, ${price}, ${stock}, ${category}, ${imageUrl})
    `;
    
    // Refreshes the admin page to show the new data
    revalidatePath('/admin'); 
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to add product to database.');
  }
}
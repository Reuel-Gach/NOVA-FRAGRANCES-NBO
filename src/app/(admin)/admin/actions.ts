'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stockQuantity = parseInt(formData.get('stock_quantity') as string);
  const imageUrl = formData.get('image_url') as string;

  try {
    // If the product_id already exists, this automatically updates it instead of crashing
    await sql`
      INSERT INTO Products (product_id, name, category, description, price, stock_quantity, image_url)
      VALUES (${productId}, ${name}, ${category}, ${description}, ${price}, ${stockQuantity}, ${imageUrl})
      ON CONFLICT (product_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        stock_quantity = EXCLUDED.stock_quantity,
        image_url = EXCLUDED.image_url
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to add product to database.');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}
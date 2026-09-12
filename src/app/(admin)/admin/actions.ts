'use server'

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. Add or Upsert a product
export async function addProduct(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stockQuantity = parseInt(formData.get('stock_quantity') as string);
  const imageUrl = formData.get('image_url') as string;

  try {
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

// 2. Update an existing product
export async function updateProduct(formData: FormData) {
  const productId = formData.get('product_id') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stockQuantity = parseInt(formData.get('stock_quantity') as string);
  const imageUrl = formData.get('image_url') as string;

  try {
    await sql`
      UPDATE Products 
      SET name = ${name}, 
          category = ${category}, 
          description = ${description}, 
          price = ${price}, 
          stock_quantity = ${stockQuantity}, 
          image_url = ${imageUrl}
      WHERE product_id = ${productId}
    `;
  } catch (error) {
    console.error('Update Error:', error);
    throw new Error('Failed to update product.');
  }

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

// 3. Delete or Archive a product safely
export async function deleteProduct(productId: string) {
  try {
    const checkOrders = await sql`
      SELECT COUNT(*) as count FROM Order_Items WHERE product_id = ${productId}
    `;
    
    const hasBeenOrdered = Number(checkOrders[0]?.count) > 0;

    if (hasBeenOrdered) {
      // Soft Archive: Set stock to 0 to preserve past order history
      await sql`
        UPDATE Products SET stock_quantity = 0 WHERE product_id = ${productId}
      `;
    } else {
      // Safe Hard Delete: Never ordered, safe to remove completely
      await sql`
        DELETE FROM Products WHERE product_id = ${productId}
      `;
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete Error:', error);
    throw new Error('Failed to delete product.');
  }
}
import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReceiptView from './ReceiptView';

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  // Fetch Order details securely on the server
  const orders = await sql`
    SELECT * FROM Orders WHERE order_id = ${orderId}
  `;

  if (orders.length === 0) {
    notFound();
  }

  const order = orders[0];

  // Fetch Order Items joined with Product names
  const items = await sql`
    SELECT oi.*, p.name as product_name, p.image_url 
    FROM Order_Items oi
    LEFT JOIN Products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ${orderId}
  `;

  return <ReceiptView order={order} items={items} />;
}
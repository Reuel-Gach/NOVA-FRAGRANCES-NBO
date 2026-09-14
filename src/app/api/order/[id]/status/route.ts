import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    const result = await sql`SELECT payment_status FROM Orders WHERE order_id = ${orderId}`;
    
    if (result.length === 0) {
      return NextResponse.json({ status: 'Not Found' }, { status: 404 });
    }
    
    return NextResponse.json({ status: result[0].payment_status });
  } catch (error) {
    return NextResponse.json({ status: 'Error' }, { status: 500 });
  }
}
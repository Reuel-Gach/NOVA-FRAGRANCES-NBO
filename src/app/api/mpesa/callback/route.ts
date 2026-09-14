import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const callbackData = body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    if (resultCode === 0) {
      // Payment Successful - Extract the M-Pesa Receipt Number
      const metadata = callbackData.CallbackMetadata.Item;
      const mpesaReceipt = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      // Update Order Status to Paid and deduct stock
      await sql`
        UPDATE Orders 
        SET payment_status = 'Paid', mpesa_receipt_number = ${mpesaReceipt}
        WHERE checkout_request_id = ${checkoutRequestId}
      `;

      // Optional: Fetch the order to get the items and deduct stock here
      // This ensures stock is ONLY deducted when payment actually clears
      const orderData = await sql`SELECT order_id FROM Orders WHERE checkout_request_id = ${checkoutRequestId}`;
      if (orderData.length > 0) {
        const orderId = orderData[0].order_id;
        const items = await sql`SELECT product_id, quantity FROM Order_Items WHERE order_id = ${orderId}`;
        
        for (const item of items) {
          await sql`
            UPDATE Products 
            SET stock_quantity = stock_quantity - ${item.quantity}
            WHERE product_id = ${item.product_id}
          `;
        }
      }
    } else {
      // Payment Failed or Cancelled
      await sql`
        UPDATE Orders 
        SET payment_status = 'Failed'
        WHERE checkout_request_id = ${checkoutRequestId}
      `;
    }

    // Safaricom expects a simple success acknowledgment
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
    
  } catch (error) {
    console.error('M-Pesa Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" }, { status: 500 });
  }
}
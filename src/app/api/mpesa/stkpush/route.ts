import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { phone, amount, orderId, customerName, location, items } = await req.json();

    // 1. Format Phone Number (convert 07... to 2547...)
    const formattedPhone = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

    // 2. Generate M-Pesa Access Token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    const { access_token } = await tokenRes.json();

    // 3. Generate Password and Timestamp
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // 4. Send STK Push Request
    const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: `Nova ${orderId.slice(0, 5)}`,
        TransactionDesc: 'Fragrance Purchase'
      })
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== '0') {
      throw new Error(stkData.errorMessage || 'STK Push Failed');
    }

    // 5. Save the Pending Order with the CheckoutRequestID
    await sql`
      INSERT INTO Orders (order_id, customer_name, customer_phone, location, total_price, payment_status, order_source, checkout_request_id)
      VALUES (${orderId}, ${customerName}, ${phone}, ${location}, ${amount}, 'Pending', 'Web', ${stkData.CheckoutRequestID})
    `;

    // Save Order Items
    for (const item of items) {
      await sql`
        INSERT INTO Order_Items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `;
    }

    return NextResponse.json({ success: true, checkoutRequestId: stkData.CheckoutRequestID });

  } catch (error: any) {
    console.error('STK Push Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
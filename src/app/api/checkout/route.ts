import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customerName, phone, location, amount, items } = body;

    // 1. Save the main order (Added 'order_source' set to 'Website')
    await sql`
      INSERT INTO Orders (order_id, customer_name, customer_phone, location, total_price, payment_status, order_source)
      VALUES (${orderId}, ${customerName}, ${phone}, ${location}, ${amount}, 'Pending Payment', 'Website')
    `;

    // 2. Save individual items
    for (const item of items) {
      await sql`
        INSERT INTO Order_Items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `;
    }

    // 3. Trigger Email Alert in the background
    triggerEmailAlert(customerName, phone, location, amount, items).catch(console.error);

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error. Could not save order.' }, 
      { status: 500 }
    );
  }
}

async function triggerEmailAlert(name: string, phone: string, location: string, amount: number, items: any[]) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format the items list for the email
  const itemsList = items.map(item => `- ${item.quantity}x ${item.name} (Ksh ${item.price})`).join('\n');

  // Smart WhatsApp Number Formatter for the email link
  let waNumber = phone?.replace(/[^0-9]/g, '') || '';
  if (waNumber.startsWith('0')) {
    waNumber = '254' + waNumber.substring(1);
  } else if (waNumber.length === 9) {
    waNumber = '254' + waNumber;
  }

  const mailOptions = {
    from: `"Nova Fragrances System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Sending to yourself
    subject: `🚨 NEW ORDER: Ksh ${amount} from ${name}`,
    text: `
      ✨ New Order Received on Nova Fragrances Nbo ✨
      
      Customer Details:
      Name: ${name}
      WhatsApp: ${phone}
      Location: ${location}
      Source: Website
      
      Order Total: Ksh ${amount}
      
      Items Ordered:
      ${itemsList}
      
      Action Required:
      Open your Admin Dashboard or click the link below to WhatsApp the customer and arrange payment/delivery:
      https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(name)},%20thank%20you%20for%20your%20order%20with%20Nova%20Fragrances%20Nbo!%20%E2%9C%A8%20Are%20you%20ready%20to%20arrange%20delivery%20to%20${encodeURIComponent(location)}%3F
    `
  };

  await transporter.sendMail(mailOptions);
}
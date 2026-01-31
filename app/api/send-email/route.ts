import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderData } = body;

    if (type === 'order_confirmation') {
      await resend.emails.send({
        from: 'ÍKHOR <onboarding@resend.dev>',
        to: orderData.customerEmail,
        subject: `✅ Orden Confirmada #${orderData.orderId.slice(0, 8).toUpperCase()} - ÍKHOR`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #d4af37;">
            <h1 style="color: #d4af37; font-size: 32px; text-align: center; margin-bottom: 30px;">¡Gracias por tu compra!</h1>
            
            <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 20px;">
              <h2 style="color: #d4af37; font-size: 18px;">Orden #${orderData.orderId.slice(0, 8).toUpperCase()}</h2>
              <p style="color: #999;"><strong>Cliente:</strong> ${orderData.customerName}</p>
              <p style="color: #999;"><strong>Ciudad:</strong> ${orderData.city}</p>
              
              <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
              
              <h3 style="color: #fff;">Productos:</h3>
              ${orderData.products.map((p: any) => `
                <div style="padding: 15px; background: rgba(255,255,255,0.02); margin: 10px 0; border-radius: 10px;">
                  <p style="color: #fff; margin: 0;">${p.name}</p>
                  <p style="color: #999; margin: 5px 0;">Cantidad: ${p.qty} × $${p.price.toFixed(2)}</p>
                </div>
              `).join('')}
              
              <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
              
              <div style="text-align: right;">
                <p style="color: #d4af37; font-size: 32px; font-weight: bold;">$${orderData.total.toFixed(2)}</p>
              </div>
            </div>
            
            <p style="text-align: center; color: #666; margin-top: 30px; font-size: 12px;">
              ÍKHOR • ECUADOR 2026
            </p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

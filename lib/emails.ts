import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  total: number;
  city: string;
  products: Array<{ name: string; price: number; qty: number }>;
}) {
  try {
    await resend.emails.send({
      from: 'ÍKHOR <onboarding@resend.dev>',
      to: orderData.customerEmail,
      subject: `✅ Orden Confirmada #${orderData.orderId.slice(0, 8).toUpperCase()} - ÍKHOR`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #d4af37;">
          <h1 style="color: #d4af37; font-size: 32px; text-align: center; margin-bottom: 30px;">¡Gracias por tu compra!</h1>
          
          <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.2);">
            <h2 style="color: #d4af37; font-size: 18px; margin-bottom: 20px;">Orden #${orderData.orderId.slice(0, 8).toUpperCase()}</h2>
            
            <p style="color: #999; margin: 10px 0;"><strong>Cliente:</strong> ${orderData.customerName}</p>
            <p style="color: #999; margin: 10px 0;"><strong>Ciudad:</strong> ${orderData.city}</p>
            
            <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            
            <h3 style="color: #fff; margin-bottom: 20px;">Productos:</h3>
            ${orderData.products.map(p => `
              <div style="padding: 15px; background: rgba(255,255,255,0.02); margin-bottom: 10px; border-radius: 10px;">
                <p style="color: #fff; margin: 0; font-weight: bold;">${p.name}</p>
                <p style="color: #999; margin: 5px 0; font-size: 14px;">Cantidad: ${p.qty} × $${p.price.toFixed(2)}</p>
              </div>
            `).join('')}
            
            <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />
            
            <div style="text-align: right;">
              <p style="color: #999; margin: 5px 0;">Total:</p>
              <p style="color: #d4af37; font-size: 32px; font-weight: bold; margin: 0;">$${orderData.total.toFixed(2)}</p>
            </div>
          </div>
          
          <p style="text-align: center; color: #666; margin-top: 40px; font-size: 12px;">
            ÍKHOR • ECUADOR 2026<br/>
            Tu pedido está siendo preparado con el mayor cuidado.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendShippingNotification(orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
}) {
  try {
    await resend.emails.send({
      from: 'ÍKHOR <onboarding@resend.dev>',
      to: orderData.customerEmail,
      subject: `🚚 Tu pedido va en camino - Orden #${orderData.orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #d4af37;">
          <h1 style="color: #d4af37; font-size: 32px; text-align: center; margin-bottom: 30px;">¡Tu pedido está en camino!</h1>
          
          <div style="background: rgba(212,175,55,0.1); padding: 30px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.3);">
            <h2 style="color: #fff; margin-bottom: 20px;">Información de Envío</h2>
            
            <p style="color: #999; margin: 10px 0;"><strong>Courier:</strong> ${orderData.courier}</p>
            <p style="color: #d4af37; margin: 10px 0; font-size: 18px;"><strong>Número de Guía:</strong> ${orderData.trackingNumber}</p>
            <p style="color: #999; margin: 10px 0;"><strong>Entrega Estimada:</strong> ${new Date(orderData.estimatedDelivery).toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          
          <p style="text-align: center; color: #666; margin-top: 40px; font-size: 12px;">
            ÍKHOR • ECUADOR 2026
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('Error sending shipping email:', error);
  }
}

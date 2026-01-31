"use client";

/**
 * ════════════════════════════════════════════════════════════
 * PAYPAL BUTTON - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Botón de pago PayPal integrado
 * 
 * FUNCIONALIDADES:
 * - Pago con PayPal (saldo o tarjeta vinculada)
 * - Pago con tarjeta de crédito/débito directamente
 * - Confirmación automática
 * - Callback cuando se completa el pago
 * ════════════════════════════════════════════════════════════
 */

import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: string; // Total en USD (ej: "83.99")
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  
  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "paypal",
      }}
      
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount,
              },
              description: "Compra en ÍKHOR - Perfumería Exclusiva",
            },
          ],
        });
      }}
      
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          onSuccess(details);
        }
      }}
      
      onError={(err) => {
        console.error("Error de PayPal:", err);
        onError(err);
      }}
    />
  );
}

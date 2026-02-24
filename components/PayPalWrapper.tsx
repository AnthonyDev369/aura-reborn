"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

if (process.env.NODE_ENV !== "production" && !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
  console.warn("[PayPalWrapper] NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set. PayPal payments will not work.");
}

export default function PayPalWrapper({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",

      currency: "USD"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}

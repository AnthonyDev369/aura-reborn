"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

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

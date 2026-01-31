"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

export default function PayPalWrapper({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider options={{
      clientId: "AfsWGPpZ4BnTjKYCXtmU76EEHuo01fnX348dE5Em_9IJPpz2y5X-Cp_AdH_SEXAXleSxpgp9fS9YZlrR",
 // Temporal - después pones el real
      currency: "USD"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}

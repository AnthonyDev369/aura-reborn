"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

export default function PayPalWrapper({ children }: { children: ReactNode }) {
  return (
    <PayPalScriptProvider options={{
      clientId: "ARn7siy3cucKi4Q4EG-C29IxCtv0RSR2Ls1yJZOp2XbBn3TqvykO9WpURvDybUkQhJ81tZxWCrOzCs0F",

      currency: "USD"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}

"use client";

import { Suspense } from "react";
import PaymentClient from "./payment-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment…</div>}>
      <PaymentClient />
    </Suspense>
  );
}

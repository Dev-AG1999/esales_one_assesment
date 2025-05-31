
// Server component (page.js)
import React, { Suspense } from 'react';
import ClientCheckout from './clientCheckout';


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientCheckout />
    </Suspense>
  );
}

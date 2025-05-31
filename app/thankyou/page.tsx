
// Server component (page.js)
import React, { Suspense } from 'react';
import ClientThankYou from './clientThankYou';


export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientThankYou />
    </Suspense>
  );
}

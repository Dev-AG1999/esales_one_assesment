'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);



  useEffect(() => {
    if (orderId) {
    
      api.get(`/orders/${orderId}`).then((res) => setOrder(res.data));
    }
  }, [orderId]);

  if (!order) return <div className="p-6">Loading...</div>;

  

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="mb-2">Your order <strong>{order.orderId}</strong> was {order.transactionStatus}.</p>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <ul className="list-disc ml-5">
            <li>Product: {order.product.name}</li>
            <li>Variant: {order.product.variant}</li>
            <li>Quantity: {order.product.quantity}</li>
            <li>Total: ${order.product.price * order.product.quantity}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Customer Info</h2>
          <ul className="list-disc ml-5">
            <li>Name: {order.customer.fullName}</li>
            <li>Email: {order.customer.email}</li>
            <li>Phone: {order.customer.phone}</li>
            <li>Address: {order.customer.address}, {order.customer.city}, {order.customer.state}, {order.customer.zip}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
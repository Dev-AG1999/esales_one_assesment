'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [variant, setVariant] = useState('Red');
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    router.push(`/checkout?variant=${variant}&quantity=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
        <img src="/product.jpg" alt="Converse" className="rounded-lg mb-4" />
        <h1 className="text-2xl font-bold mb-2">Converse Chuck Taylor All Star II Hi</h1>
        <p className="text-gray-600 mb-4">A modern update to the iconic Chuck Taylor All Star silhouette.</p>
        <p className="text-lg font-semibold mb-4">$50.00</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Color Variant</label>
          <select value={variant} onChange={(e) => setVariant(e.target.value)} className="border p-2 w-full rounded">
            <option value="Red">Red</option>
            <option value="Black">Black</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          onClick={handleBuyNow}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

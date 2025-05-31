
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  variants: string[];
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    simulateCode: '1'
  });

  const variant = searchParams.get('variant') || '';
  const quantity = Number(searchParams.get('quantity') || 1);

  useEffect(() => {
    fetch('/products.json')
      .then((res) => res.json())
      .then((data: Product[]) => {
    
        const match = data.find((p) => p.variants.includes(variant) || variant === '');
        setSelectedProduct(match || null);
      });
  }, [variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);
  const validateCardNumber = (number: string) => /^\d{16}$/.test(number);
  const validateCVV = (cvv: string) => /^\d{3}$/.test(cvv);
  const validateExpiryDate = (date: string) => {
    if (!/^\d{2}\/\d{4}$/.test(date)) return false;
    const [mm, yyyy] = date.split('/').map(Number);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const expiry = new Date(yyyy, mm);
    return expiry > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Validations
    if (!form.fullName.trim()) return alert('Full name is required');
    if (!validateEmail(form.email)) return alert('Invalid email address');
    if (!validatePhone(form.phone)) return alert('Phone must be 10 digits');
    if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !form.zip.trim()) {
      return alert('Complete address is required');
    }
    if (!validateCardNumber(form.cardNumber)) return alert('Card number must be 16 digits');
    if (!validateExpiryDate(form.expiryDate)) return alert('Expiry date must be MM/YYYY and in the future');
    if (!validateCVV(form.cvv)) return alert('CVV must be 3 digits');

    try {
      const res = await api.post('/orders', {
        product: {
          name: selectedProduct.title,
          variant,
          quantity,
          price: selectedProduct.price,
        },
        customer: form,
        simulateCode: form.simulateCode,
      });
      router.push(`/thankyou?orderId=${res.data.orderId}`);
    } catch (err: any) {
      console.error('Error placing order:', err.response?.data || err.message);
      alert('Order submission failed.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border w-full p-2 rounded" required />
          <h2 className="text-2xl font-semibold">Delivery</h2>
          <input name="fullName" placeholder="Full name" onChange={handleChange} className="border w-full p-2 rounded" required />
          <input name="address" placeholder="Address" onChange={handleChange} className="border w-full p-2 rounded" required />
          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" onChange={handleChange} className="border p-2 rounded" required />
            <input name="state" placeholder="State" onChange={handleChange} className="border p-2 rounded" required />
            <input name="zip" placeholder="PIN code" onChange={handleChange} className="border p-2 rounded col-span-2" required />
          </div>
          <input name="phone" placeholder="Phone (10 digits)" onChange={handleChange} className="border w-full p-2 rounded" required />

          <h2 className="text-2xl font-semibold">Payment</h2>
          <input name="cardNumber" placeholder="Card Number (16 digits)" onChange={handleChange} className="border p-2 rounded w-full" required />
          <div className="grid grid-cols-2 gap-4">
            <input name="expiryDate" placeholder="MM/YYYY" onChange={handleChange} className="border p-2 rounded" required />
            <input name="cvv" placeholder="CVV (3 digits)" onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <label className="block mt-4">
            Simulate Transaction
            <select name="simulateCode" onChange={handleChange} value={form.simulateCode} className="border p-2 w-full rounded">
              <option value="1">Approved</option>
              <option value="2">Declined</option>
              <option value="3">Gateway Error</option>
            </select>
          </label>

          <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 mt-4">
            Submit Order
          </button>
        </form>

        {selectedProduct && (
          <div className="border p-6 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex gap-4 items-start">
              <img src={selectedProduct.image} className="w-24 h-24 object-contain rounded" alt={selectedProduct.title} />
              <div>
                <p className="font-medium">{selectedProduct.title}</p>
                {variant && <p className="text-sm text-gray-600">Color: {variant}</p>}
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-sm">Subtotal: Rs. {(selectedProduct.price * quantity).toFixed(2)}</p>
              <p className="text-sm">Estimated Tax: Rs. {(selectedProduct.price * quantity * 0.18).toFixed(2)}</p>
              <p className="font-bold mt-2">Total: Rs. {(selectedProduct.price * quantity * 1.18).toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
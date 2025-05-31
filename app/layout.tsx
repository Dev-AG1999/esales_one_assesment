
import "../app/styles/globals.css"
export const metadata = {
  title: 'eCommerce Checkout Simulation',
  description: 'A minimal eCommerce checkout flow built with Next.js.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 font-sans">{children}</body>
    </html>
  );
}

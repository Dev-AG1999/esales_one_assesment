'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './lib/api';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  variants: string[];
  buttonText?: string;
}

const ITEMS_PER_LOAD = 8;

export default function LandingPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // For search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

   // Load all products


  useEffect(() => {
  setIsLoading(true);

      const getAllProducts = async()=> {

 const res =  await  api.get('/products')
 

 console.log(res.data.products);
 
      setIsLoading(false);
      setAllProducts(res.data.products);
      setVisibleProducts(res.data.products.slice(0, ITEMS_PER_LOAD));
      setHasMore(res.data.products.length > ITEMS_PER_LOAD);
 
  }
  getAllProducts();

     
  

}, []);


  // Load more
  const loadMore = useCallback(() => {
    if (searchTerm) return; 
    const start = page * ITEMS_PER_LOAD;
    const end = start + ITEMS_PER_LOAD;
    const moreItems = allProducts.slice(start, end);
    setVisibleProducts((prev) => [...prev, ...moreItems]);
    setHasMore(allProducts.length > end);
    setPage((prev) => prev + 1);
  }, [allProducts, page, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader, loadMore, hasMore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!value) {
      // If search cleared, reset search results
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    // Debounce search 
    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  async function performSearch(query: string) {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await api.post('/search', {
      product:query
      });
     
console.log("line 102",res);

    
      setSearchResults(res.data.products || []);
    } catch (error) {
      setSearchError('Error fetching search results');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  // Selected product state & handlers (unchanged)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState('');

  const handleChooseOptions = (product: Product) => {
    setSelectedProduct(product);
    setVariant(product.variants[0] || '');
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      router.push(`/checkout?variant=${variant}&quantity=${quantity}`);
    }
  };

  // Determine products to display:
  // If searching, show searchResults; else show visibleProducts (paginated)
  const productsToShow = searchTerm ? searchResults || [] : visibleProducts;

  return (
    <div className="min-h-screen bg-[#1a1c23] text-white py-10 px-6">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchLoading && <p className="mt-2 text-sm text-gray-300">Searching...</p>}
        {searchError && <p className="mt-2 text-sm text-red-500">{searchError}</p>}
        {searchTerm && !searchLoading && productsToShow.length === 0 && (
          <p className="mt-2 text-sm text-gray-400">No products found</p>
        )}
      </div>

      {/* Products Grid */}
      {isLoading && !searchTerm ? (
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {productsToShow?.map((product) => (
            <div key={product?.id} className="bg-[#111217] rounded-lg overflow-hidden shadow-md">
              <div className="bg-white p-4">
                <img
                  src={product?.image}
                  alt={product?.title}
                  className="object-contain w-full h-64 rounded"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold uppercase tracking-wide">{product?.title}</p>
                <p className="text-white text-lg mt-1 font-semibold">Rs. {product.price?.toFixed(2)}</p>
                {product?.variants?.length > 0 ? (
                  <button
                    className="mt-4 w-full border border-white py-2 text-white hover:bg-white hover:text-black transition rounded"
                    onClick={() => handleChooseOptions(product)}
                  >
                    {product?.buttonText || 'Choose options'}
                  </button>
                ) : (
                  <button
                    className="mt-4 w-full border border-white py-2 text-white hover:bg-white hover:text-black transition rounded"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader only if not searching */}
      {!searchTerm && (
        <div ref={loader} className="h-16 mt-10 text-center text-gray-400">
          {hasMore ? 'Loading' : 'No more products'}
        </div>
      )}

      {/* Choose Options Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Choose Options</h2>
            <p className="mb-2 font-medium">{selectedProduct.title}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex gap-2">
                {selectedProduct.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-4 py-1 rounded-full border ${
                      variant === v ? 'bg-black text-white' : 'bg-gray-200 text-black'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <div className="flex items-center border border-gray-400 w-max rounded">
                <button
                  type="button"
                  className="px-3 py-1 text-lg"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1 text-lg">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-1 text-lg"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <p className="text-lg font-semibold mb-4">Rs. {selectedProduct.price.toFixed(2)}</p>
            <div className="space-y-3">
              <button
                className="w-full border border-black text-black py-2 rounded hover:bg-black hover:text-white"
                onClick={() => router.push(`/checkout?variant=${variant}&quantity=${quantity}`)}
              >
                Add to cart
              </button>
              <button
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                onClick={handleBuyNow}
              >
                Buy it now
              </button>
              <button
                className="text-sm underline text-center w-full mt-2"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

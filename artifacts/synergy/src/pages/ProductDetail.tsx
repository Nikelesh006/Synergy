import { Link, useParams, useLocation } from "wouter";
import { Star, Check, Heart, Share2, Info, ShoppingCart, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import NotFound from "./not-found";

export default function ProductDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const product = products.find(p => p.slug === slug);
  const { addToCart, addToWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return <NotFound />;

  const roundToEnding9 = (n: number) => Math.floor(n / 10) * 10 - 1;
  const sellingPrice = roundToEnding9(product.price);
  const originalPrice = roundToEnding9(product.price / 0.82);
  const savings = Math.max(0, originalPrice - sellingPrice);

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-blue-600">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="aspect-square bg-white rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
               <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-20 h-20 bg-white rounded-md border ${i === activeImage ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200'} flex-shrink-0 overflow-hidden`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-7/12">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">{product.brand}</span>
              <span className="text-sm text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            


            <div className="mb-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-gray-900">₹{sellingPrice.toLocaleString('en-IN')}</span>
                  <span className="text-lg text-gray-400 line-through mb-1">₹{originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => addToWishlist(product)}
                    aria-label="Add to wishlist"
                    className={`group/wishlist flex items-center gap-1.5 text-sm font-medium transition-colors ${isInWishlist(product.id) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                  >
                    <Heart className={`h-5 w-5 transition-all duration-300 ${isInWishlist(product.id) ? 'fill-current' : 'group-hover/wishlist:fill-current group-hover/wishlist:scale-110'}`} />
                    <span>{isInWishlist(product.id) ? 'Saved' : 'Wishlist'}</span>
                  </button>
                  <button
                    aria-label="Share product"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium mb-4">You save ₹{savings.toLocaleString('en-IN')}</p>

              <Separator className="my-4 bg-slate-200" />

              <p className="text-xs text-gray-500">Taxes (18% GST) are excluded</p>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8 text-sm">
              {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-2xl h-12 w-32 shrink-0 overflow-hidden">
                <button 
                  className="px-4 text-gray-500 hover:bg-gray-100 h-full flex items-center justify-center rounded-l-2xl"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >-</button>
                <input 
                  type="number" 
                  value={qty} 
                  readOnly 
                  className="w-full text-center border-0 font-medium text-gray-900 p-0 focus:ring-0"
                />
                <button 
                  className="px-4 text-gray-500 hover:bg-gray-100 h-full flex items-center justify-center rounded-r-2xl"
                  onClick={() => setQty(qty + 1)}
                >+</button>
              </div>
              
              <Button 
                onClick={() => addToCart(product, qty)}
                className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-2xl shadow-sm group"
              >
                <div className="flex items-center justify-center">
                  <span>Add to Cart</span>
                  <ShoppingCart strokeWidth={3} className="w-0 h-7 opacity-0 group-hover:w-7 group-hover:scale-125 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out origin-left" />
                </div>
              </Button>
              
              <Button 
                onClick={() => {
                  addToCart(product, qty);
                  setLocation('/checkout');
                }}
                className="flex-1 h-12 bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold rounded-2xl shadow-sm group"
              >
                <div className="flex items-center justify-center">
                  <span>Buy Now</span>
                  <ShoppingBag strokeWidth={3} className="w-0 h-7 opacity-0 group-hover:w-7 group-hover:scale-125 group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out origin-left" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200 flex gap-8">
            <button 
              className={`pb-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'description' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`pb-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'specs' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-700">
                <p>{product.description}</p>
                <h4 className="text-gray-900 font-bold mt-6 mb-4">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <th className="px-6 py-4 font-medium text-gray-900 w-1/3 border border-gray-200">{key}</th>
                        <td className="px-6 py-4 border border-gray-200">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

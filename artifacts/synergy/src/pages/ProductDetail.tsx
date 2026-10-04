import { Link, useParams, useLocation } from "wouter";
import { Star, Check, Heart, Share2, Info, ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import NotFound from "./not-found";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { getProductDisplayImage, getCategoryFallbackImage } from "@/lib/productImage";

export default function ProductDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { data: product, isLoading, isError } = useProduct(slug || "");
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [slug]);

  useEffect(() => {
    if (!isLoading && product && typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [isLoading, product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !product) return <NotFound />;

  const roundToEnding9 = (n: number) => Math.floor(n / 10) * 10 - 1;
  const sellingPrice = roundToEnding9(product.price);
  const originalPrice = roundToEnding9(product.price / 0.82);
  const savings = Math.max(0, originalPrice - sellingPrice);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Synergy Tech Labs`,
          url,
        });
      } catch {
        // User canceled or dismissed share sheet
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
        duration: 2500,
      });
    }
  };

  return (
    <div className="bg-white py-4 sm:py-8">
      <div className="container mx-auto px-3.5 sm:px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-6 flex-wrap gap-1">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-1 sm:mx-1.5 text-gray-400">/</span>
          <Link href="/shop" className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span className="mx-1 sm:mx-1.5 text-gray-400">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[180px] sm:max-w-none">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="w-full lg:w-5/12 flex flex-col gap-2.5 sm:gap-4">
            <div className="aspect-square bg-slate-50 rounded-xl sm:rounded-2xl border border-gray-200/90 flex items-center justify-center relative overflow-hidden shadow-2xs">
               <img
                 src={getProductDisplayImage(product.images?.[activeImage], product.category, product.subcategory, 1000)}
                 alt={product.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   e.currentTarget.onerror = null;
                   e.currentTarget.src = getCategoryFallbackImage(product.category, product.subcategory);
                 }}
               />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`w-14 h-14 sm:w-20 sm:h-20 bg-slate-50 rounded-lg sm:rounded-xl border ${i === activeImage ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-gray-200 hover:border-gray-300'} flex-shrink-0 overflow-hidden transition-all`}
                  >
                    <img
                      src={getProductDisplayImage(img, product.category, product.subcategory, 200)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getCategoryFallbackImage(product.category, product.subcategory);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-7/12">
            {/* Brand & SKU Header */}
            <div className="mb-1.5 sm:mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <span className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wider uppercase">{product.brand}</span>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-mono">
                <span>SKU: {product.sku}</span>
                {product.hsnCode && (
                  <span className="hidden xs:inline">• HSN: {product.hsnCode}</span>
                )}
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight leading-snug">{product.name}</h1>
            
            {/* Price & Quick Actions Card */}
            <div className="mb-4 sm:mb-6 bg-slate-50 p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                    ₹{sellingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs sm:text-base lg:text-lg text-gray-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  {savings > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800">
                      Save ₹{savings.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Wishlist & Share buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                        toast({
                          title: "Removed from Wishlist",
                          description: `${product.name} has been removed from your wishlist.`,
                          duration: 2500,
                        });
                        return;
                      }
                      addToWishlist(product);
                      toast({
                        title: "Saved to Wishlist",
                        description: `${product.name} has been added to your wishlist.`,
                        variant: "wishlist",
                        duration: 3000,
                        action: (
                          <ToastAction altText="View wishlist" asChild>
                            <Link href="/wishlist" className="inline-flex items-center gap-1">
                              View Wishlist
                              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Link>
                          </ToastAction>
                        ),
                      });
                    }}
                    aria-label="Add to wishlist"
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1.5 ${
                      isInWishlist(product.id) ? "text-red-600 border-red-200 bg-red-50/60" : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-all duration-300 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    <span className="hidden sm:inline text-xs font-semibold">
                      {isInWishlist(product.id) ? "Saved" : "Wishlist"}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    aria-label="Share product"
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs hover:bg-slate-50 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                  >
                    <Share2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    <span className="hidden sm:inline text-xs font-semibold">Share</span>
                  </button>
                </div>
              </div>

              {/* Sub-info bar */}
              <div className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] sm:text-xs text-gray-500">
                <span>Taxes (18% GST) are excluded</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> In Stock & Ready to Ship
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 md:gap-x-8 gap-y-2 sm:gap-y-3 mb-5 sm:mb-8 text-xs sm:text-sm">
              {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline gap-1 border-b border-dashed border-gray-200 pb-1.5">
                  <span className="text-gray-500 text-[11px] sm:text-xs truncate">{key}</span>
                  <span className="font-semibold text-gray-900 text-[11px] sm:text-xs text-right truncate">{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-xl sm:rounded-2xl h-11 sm:h-12 w-28 sm:w-32 shrink-0 overflow-hidden bg-slate-50/50">
                  <button 
                    type="button"
                    className="px-3 text-gray-600 hover:bg-gray-200/60 active:bg-gray-300 h-full flex items-center justify-center font-bold text-base transition-colors"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                  >-</button>
                  <input 
                    type="number" 
                    value={qty} 
                    readOnly 
                    className="w-full text-center border-0 font-bold text-gray-900 text-sm sm:text-base p-0 focus:ring-0 bg-transparent"
                    aria-label="Quantity"
                  />
                  <button 
                    type="button"
                    className="px-3 text-gray-600 hover:bg-gray-200/60 active:bg-gray-300 h-full flex items-center justify-center font-bold text-base transition-colors"
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                
                {/* Add to Cart */}
                <Button
                  onClick={() => {
                    addToCart(product, qty);
                    toast({
                      title: "Added to Cart",
                      description: `${product.name} has been added to your cart.`,
                      variant: "cart",
                      duration: 3000,
                      action: (
                        <ToastAction altText="View cart" asChild>
                          <Link href="/cart" className="inline-flex items-center gap-1">
                            View Cart
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </Link>
                        </ToastAction>
                      ),
                    });
                  }}
                  className="flex-1 sm:flex-1 h-11 sm:h-12 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-xs transition-all"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add to Cart</span>
                  </div>
                </Button>
              </div>

              {/* Buy Now */}
              <Button 
                onClick={() => {
                  addToCart(product, qty);
                  setLocation('/checkout');
                }}
                className="w-full sm:flex-1 h-11 sm:h-12 bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-xs transition-all"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Buy Now</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16 border-t border-slate-200 pt-6 sm:pt-8">
          <div className="border-b border-gray-200 flex gap-4 sm:gap-8 overflow-x-auto">
            <button 
              className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === 'description' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === 'specs' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
          </div>
          
          <div className="py-4 sm:py-8">
            {activeTab === 'description' && (
              <div className="prose prose-slate max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>{product.description}</p>
                <h4 className="text-gray-900 font-bold text-base sm:text-lg mt-5 mb-3 sm:mt-6 sm:mb-4">Key Features</h4>
                <ul className="space-y-2 text-sm sm:text-base">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                <table className="w-full text-xs sm:text-sm text-left text-gray-700">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                        <th className="px-3.5 py-2.5 sm:px-6 sm:py-4 font-semibold text-gray-900 w-2/5 sm:w-1/3 border-b border-gray-200">{key}</th>
                        <td className="px-3.5 py-2.5 sm:px-6 sm:py-4 border-b border-gray-200">{value}</td>
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

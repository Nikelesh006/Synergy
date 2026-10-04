import { Link } from "wouter";
import { ShoppingCart, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { getProductDisplayImage, getCategoryFallbackImage } from "@/lib/productImage";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
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
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  const roundToEnding9 = (n: number) => Math.floor(n / 10) * 10 - 1;

  const originalPrice = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice
    : null;
  const displayPrice = roundToEnding9(product.price);
  const displayOriginalPrice = originalPrice ? roundToEnding9(originalPrice) : null;
  const savings = displayOriginalPrice ? displayOriginalPrice - displayPrice : 0;
  const discount = displayOriginalPrice ? Math.round((savings / displayOriginalPrice) * 100) : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          if (document.documentElement) document.documentElement.scrollTop = 0;
          if (document.body) document.body.scrollTop = 0;
        }
      }}
      className="group relative flex flex-col bg-gradient-to-b from-white to-gray-50/60 border border-gray-200/80 rounded-2xl hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-purple-50/0 group-hover:from-blue-50/40 group-hover:to-purple-50/30 transition-all duration-500 pointer-events-none" />

      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="bg-gradient-to-r from-red-500 to-rose-600 rounded-md font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-[10px] tracking-wide shadow-sm border-0"
          >
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-slate-50">
        <img
          src={getProductDisplayImage(product.images?.[0], product.category, product.subcategory, 500)}
          alt={product.name}
          className="relative w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getCategoryFallbackImage(product.category, product.subcategory);
          }}
        />

        {/* Quick Actions (Hover on desktop, always visible on mobile) */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 flex flex-col gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-x-0 sm:translate-x-2 sm:group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={`group/wishlist p-1.5 sm:p-2.5 bg-white/95 sm:bg-white/90 backdrop-blur-sm rounded-full shadow-md sm:shadow-lg hover:bg-red-50 border border-gray-100 transition-all ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${isInWishlist(product.id) ? 'fill-current' : 'group-hover/wishlist:fill-current group-hover/wishlist:scale-110'}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-2 sm:p-4 sm:pt-3 sm:pb-3 flex flex-col flex-1 border-t border-gray-100/80 bg-white/60 backdrop-blur-sm">
        <div className="text-[9px] sm:text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
          {product.brand}
        </div>

        <h3 className="font-semibold text-gray-900 text-[11px] sm:text-sm leading-tight sm:leading-snug mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2rem] sm:min-h-[2.4rem]">
          {product.name}
        </h3>

        <div className="mt-auto pt-1 sm:pt-2 flex items-end justify-between gap-1 sm:gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-lg font-extrabold text-gray-900 tracking-tight">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayOriginalPrice && (
                <span className="text-[9px] sm:text-[11px] text-gray-400 line-through font-medium">
                  ₹{displayOriginalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="text-[9px] sm:text-[11px] text-emerald-600 font-semibold mt-0.5">
                You save ₹{savings.toLocaleString('en-IN')}
              </div>
            )}
            <div className="hidden sm:flex text-[10px] text-gray-500 mt-1 items-center gap-1 font-medium">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              GST Invoice Available
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="group/btn relative h-8 w-8 sm:h-10 sm:w-10 p-0 hover:w-20 sm:hover:w-24 hover:pr-2 rounded-full bg-slate-900 text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden border-0 shrink-0"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-transform duration-300 group-hover/btn:-translate-x-3 sm:group-hover/btn:-translate-x-3.5 group-hover/btn:scale-110" />
            <span className="absolute right-2 sm:right-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 text-xs sm:text-sm font-bold whitespace-nowrap tracking-wide">
              Add
            </span>
          </Button>
        </div>
      </div>
    </Link>
  );
}

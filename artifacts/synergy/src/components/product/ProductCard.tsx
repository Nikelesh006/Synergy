import { Link } from "wouter";
import { ShoppingCart, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist } = useStore();
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
    if (isInWishlist(product.id)) return;
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
      className="group relative flex flex-col bg-gradient-to-b from-white to-gray-50/60 border border-gray-200/80 rounded-2xl hover:border-gray-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
    >
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-purple-50/0 group-hover:from-blue-50/40 group-hover:to-purple-50/30 transition-all duration-500 pointer-events-none" />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="bg-gradient-to-r from-red-500 to-rose-600 rounded-md font-bold px-2 py-1 text-[10px] tracking-wide shadow-sm border-0"
          >
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="relative w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quick Actions (Hover) */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={`group/wishlist p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 border border-gray-100 transition-all ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${isInWishlist(product.id) ? 'fill-current' : 'group-hover/wishlist:fill-current group-hover/wishlist:scale-110'}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4 pt-3 pb-3 flex flex-col flex-1 border-t border-gray-100/80 bg-white/60 backdrop-blur-sm">
        <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-1">
          {product.brand}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.4rem]">
          {product.name}
        </h3>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayOriginalPrice && (
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  ₹{displayOriginalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                You save ₹{savings.toLocaleString('en-IN')}
              </div>
            )}
            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              GST Invoice Available
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="group/btn relative h-10 w-10 p-0 hover:w-24 hover:pr-2 rounded-full bg-slate-900 text-white shadow-md hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 ease-out flex items-center justify-center overflow-hidden border-0 shrink-0"
          >
            <ShoppingCart className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:-translate-x-3.5 group-hover/btn:scale-110" />
            <span className="absolute right-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 text-sm font-bold whitespace-nowrap tracking-wide">
              Add
            </span>
          </Button>
        </div>
      </div>
    </Link>
  );
}

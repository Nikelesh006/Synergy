import { Link } from "wouter";
import { Star, ShoppingCart, Heart, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
      description: `${product.name} added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    toast({
      title: "Saved to Wishlist",
      description: `${product.name} saved to your wishlist.`,
    });
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col bg-white border border-gray-200 rounded-md hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {discount > 0 && (
          <Badge variant="destructive" className="bg-red-600 rounded-sm font-bold px-2 py-0.5 text-xs">
            {discount}% OFF
          </Badge>
        )}
        {product.isNewArrival && (
          <Badge className="bg-blue-600 hover:bg-blue-600 rounded-sm font-bold px-2 py-0.5 text-xs">
            NEW
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square p-4 flex items-center justify-center bg-white">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-contain w-full h-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Quick Actions (Hover) */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleWishlist}
            className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-50 border border-gray-100 transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-1 font-medium">{product.brand}</div>
        
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-bold ml-1 text-gray-700">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.compareAtPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-green-600" />
              GST Invoice Available
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="h-10 w-10 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

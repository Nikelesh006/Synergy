import { Link } from "wouter";
import { Heart, ArrowRight, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  const { wishlist, addToCart } = useStore();
  const { toast } = useToast();

  const handleAddAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => addToCart(item.product, 1));
    toast({
      title: "Added All to Cart",
      description: `All ${wishlist.length} item(s) from your wishlist have been added to your cart.`,
      variant: "cart",
      duration: 3000,
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm">
              <Heart className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-6 bg-foreground/30" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Your Wishlist
              </span>
              <span className="h-px w-6 bg-foreground/30" />
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your wishlist is empty
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Save items you want to buy later by clicking the heart icon on any
              product. Your saved items will appear here.
            </p>
            <div className="mt-7">
              <Button
                asChild
                className="h-11 rounded-full bg-blue-600 px-6 text-white border-blue-700 hover:bg-blue-700"
              >
                <Link href="/shop">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-5 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-5 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleAddAllToCart}
            className="w-full sm:w-auto border-gray-300 text-gray-700 text-xs sm:text-sm font-medium h-9 sm:h-10 hover:bg-slate-100 flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <span>Add All to Cart</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-x-4 md:gap-x-6 gap-y-4 sm:gap-y-10 md:gap-y-12">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      </div>
    </div>
  );
}

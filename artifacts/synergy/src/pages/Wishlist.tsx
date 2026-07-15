import { Link } from "wouter";
import { Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { wishlist } = useStore();

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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">{wishlist.length} items saved</p>
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-700">
            Add All to Cart
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-8 sm:gap-y-10 md:gap-y-12">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      </div>
    </div>
  );
}

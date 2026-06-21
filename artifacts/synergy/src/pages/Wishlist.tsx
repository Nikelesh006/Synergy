import { Link } from "wouter";
import { HeartCrack } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <HeartCrack className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Save items you want to buy later by clicking the heart icon on any product.</p>
        <Link href="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12">
            Explore Products
          </Button>
        </Link>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { brands } from "@/data/brands";
import { Link } from "wouter";

export default function Brands() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Brand</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We partner with leading tech manufacturers to bring you high-quality components and tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map(brand => (
            <Link key={brand.id} href={`/shop?brand=${brand.slug}`} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all group text-center flex flex-col items-center justify-center min-h-[200px]">
              {/* Logo Placeholder */}
              <div className="text-2xl font-black tracking-tighter text-gray-300 group-hover:text-blue-600 transition-colors mb-4">
                {brand.name.toUpperCase()}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{brand.name}</h3>
              <p className="text-xs text-gray-500">{brand.productCount} Products</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

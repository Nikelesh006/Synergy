import { useState } from "react";
import { Link } from "wouter";
import { Filter, ChevronDown } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">All Products</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">Showing 1–{products.length} of {products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-md p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Filter className="h-5 w-5 text-gray-700" />
                <h2 className="font-bold text-gray-900">Filters</h2>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 flex justify-between items-center">
                  Categories <ChevronDown className="h-4 w-4 text-gray-400" />
                </h3>
                <ul className="space-y-2">
                  {categories.slice(0, 8).map(cat => (
                    <li key={cat.id}>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-600 group-hover:text-blue-600">{cat.name}</span>
                        <span className="ml-auto text-xs text-gray-400">({cat.productCount})</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 flex justify-between items-center">
                  Brands <ChevronDown className="h-4 w-4 text-gray-400" />
                </h3>
                <ul className="space-y-2">
                  {brands.slice(0, 6).map(brand => (
                    <li key={brand.id}>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-600 group-hover:text-blue-600">{brand.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Filter Placeholder */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3 flex justify-between items-center">
                  Price Range <ChevronDown className="h-4 w-4 text-gray-400" />
                </h3>
                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full relative">
                    <div className="absolute left-[20%] right-[30%] top-0 bottom-0 bg-blue-600 rounded-full"></div>
                    <div className="absolute left-[20%] top-1/2 -translate-y-1/2 h-4 w-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer"></div>
                    <div className="absolute right-[30%] top-1/2 -translate-y-1/2 h-4 w-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer"></div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <input type="number" placeholder="Min" className="w-full text-sm border-gray-300 rounded px-2 py-1" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" className="w-full text-sm border-gray-300 rounded px-2 py-1" />
                  </div>
                </div>
              </div>
              
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  MCB <button className="ml-1.5 hover:text-blue-900">&times;</button>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Clear All
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select className="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                  <option>Bestselling</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>&lt;</Button>
                <Button variant="outline" className="h-8 w-8 bg-blue-50 text-blue-600 border-blue-200">1</Button>
                <Button variant="outline" className="h-8 w-8">2</Button>
                <Button variant="outline" className="h-8 w-8">3</Button>
                <span className="px-2 text-gray-400">...</span>
                <Button variant="outline" className="h-8 w-8">12</Button>
                <Button variant="outline" size="icon" className="h-8 w-8">&gt;</Button>
              </nav>
            </div>
            
          </main>
        </div>
      </div>
    </div>
  );
}

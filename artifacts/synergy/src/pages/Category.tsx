import { useState } from "react";
import { Link, useParams } from "wouter";
import { Filter, ChevronDown, Package } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import NotFound from "./not-found";

export default function Category() {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);
  
  if (!category) return <NotFound />;
  
  const categoryProducts = products.filter(p => p.category === category.name);
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Category Hero */}
      <div className="bg-slate-900 text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-white">Categories</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">{category.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-600 rounded-md flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-gray-300 max-w-2xl">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-md p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <Filter className="h-5 w-5 text-gray-700" />
                <h2 className="font-bold text-gray-900">Filters</h2>
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
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {categoryProducts.length} products in {category.name}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select className="border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500">
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-md p-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">We couldn't find any products in this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

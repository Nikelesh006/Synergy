import { Link } from "wouter";
import { ArrowRight, ShieldAlert, Truck, ChevronRight, Package, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const topCategories = categories.slice(0, 8);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/1a1a2e/333333?text=Industrial+Background')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 bg-blue-600 text-white text-xs font-bold tracking-wider rounded-sm mb-6 uppercase">
              Innovation & Technology Partner
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Next-Gen Solutions for Industry 4.0
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Specializing in Embedded Systems, IoT, Edge AI, Robotics, and Industrial Automation. We transform ideas into reliable, scalable products.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <Button size="lg" className="bg-red-600 hover:bg-red-800 text-white rounded-sm px-8 font-semibold h-12">
                  Discover Our Mission
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-slate-800 rounded-sm px-8 font-semibold h-12">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-md shadow-lg border border-gray-100 p-6 flex flex-wrap md:flex-nowrap justify-between gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Genuine Products</h4>
              <p className="text-xs text-gray-500">100% authentic sourced directly</p>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-200"></div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Receipt className="h-8 w-8 text-yellow-500" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">GST Billing</h4>
              <p className="text-xs text-gray-500">Input tax credit available</p>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-200"></div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Truck className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Fast Dispatch</h4>
              <p className="text-xs text-gray-500">Pan-India delivery network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Explore our comprehensive industrial catalog</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topCategories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center p-4 bg-gray-50 rounded-md hover:bg-blue-50 border border-gray-100 transition-colors text-center group">
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:shadow text-blue-600">
                {/* Generic icon placeholder based on category */}
                <Package className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-700 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            See More <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* B2B Strip */}
      <section className="container mx-auto px-4">
        <div className="bg-blue-900 rounded-lg overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 md:w-2/3">
            <Badge className="bg-blue-800 text-blue-200 hover:bg-blue-800 mb-4 px-3 py-1">INDUSTRY & ACADEMIA</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Looking for Custom Solutions or Training?</h2>
            <p className="text-blue-100 mb-8 max-w-xl">
              We offer specialized hands-on training programs in IoT, Robotics, and Edge AI, as well as customized industrial implementations to bridge the gap between emerging tech and real-world applications.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-semibold">
                Request a Consultation
              </Button>
            </Link>
          </div>
          <div className="md:w-1/3 bg-blue-800 w-full h-full min-h-[200px] flex items-center justify-center relative overflow-hidden">
            {/* Visual placeholder */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://placehold.co/600x400/000000/333333?text=Blueprint')] bg-cover"></div>
            <Package className="h-24 w-24 text-blue-400 opacity-50 relative z-10" />
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      <section className="container mx-auto px-4 py-8 border-y border-gray-200 mt-4">
        <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-8">Trusted by industry leaders</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.slice(0, 6).map(brand => (
            <Link href={`/shop?brand=${brand.slug}`} key={brand.id} className="text-xl font-black tracking-tighter text-gray-800 hover:text-blue-600 cursor-pointer">
              {brand.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

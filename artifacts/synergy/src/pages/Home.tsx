import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ShieldAlert, Truck, ChevronRight, Package, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/layout/SectionHeader";
import BlogsSlider from "@/components/blog/BlogsSlider";

const banners = [
  "/banner-1.jpg",
  "/banner-2.jpg",
  "/banner-3.jpg",
  "/banner-4.jpg",
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const topCategories = categories.slice(0, 8);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative w-full aspect-[8/3] bg-gray-100 overflow-hidden pb-6">
        {banners.map((bg, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img 
              src={bg} 
              alt={`Banner ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/1920x720/1a1a2e/ffffff?text=Banner+${index + 1}+-+8:3+Ratio`;
              }}
            />
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${index === currentBanner ? "bg-white w-8" : "bg-white/50 hover:bg-white/80 w-2"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>



      {/* Categories */}
      <section className="container mx-auto px-4 mt-4 pb-6">
        <SectionHeader
          title="Categories"
          subtitle="Explore our comprehensive industrial catalog"
          action={
            <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="mb-5"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { id: 1, name: <>IOT Development<br/>Boards</>, slug: "iot" },
            { id: 2, name: <>AI Development<br/>Boards</>, slug: "ai" },
            { id: 3, name: <>Robotics Development<br/>Boards</>, slug: "robotics" },
            { id: 4, name: <>Embedded Systems<br/>Development Boards</>, slug: "embedded-systems-boards" },
            { id: 5, name: "Lab Equipments", slug: "lab-equipments" }
          ].map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center group">
              <div className="w-full aspect-square bg-gray-50 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center mb-4 group-hover:shadow-md group-hover:border-blue-300 transition-all overflow-hidden relative">
                {/* Fallback Icon - you can replace this completely with an <img /> tag when ready */}
                <Package className="h-12 w-12 text-blue-500/50 absolute" />
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-6">
        <SectionHeader
          title="Featured Products"
          action={
            <Link href="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="mb-5"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product Banner Placeholder */}
      <section className="container mx-auto px-4 pb-6">
        <div className="relative aspect-[5/1] min-h-[150px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
          <img
            src="https://placehold.co/1600x320/e2e8f0/334155?text=Product+Banner+Placeholder"
            alt="Product banner placeholder"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Blogs — sliding row, advances one card at a time, loops, pauses on hover */}
      <section className="container mx-auto px-4 pb-6">
        <SectionHeader
          title="Blogs"
          action={
            <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="mb-10"
        />
        <BlogsSlider />
      </section>

      {/* Tutorials */}
      <section className="container mx-auto px-4 pb-6">
        <SectionHeader
          title="Tutorials"
          action={
            <Link href="/tutorials" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="mb-5"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {[1, 2, 3, 4].map((item) => (
            <div key={`tutorial-${item}`} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <img src={`https://placehold.co/400x225/e2e8f0/475569?text=Video+Thumbnail+${item}`} alt={`Tutorial ${item}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 mb-2 border-none">Video Guide</Badge>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Getting Started with Edge AI</h3>
                <p className="text-sm text-gray-500 line-clamp-2">A comprehensive video guide to setting up your first Edge AI project using our development boards.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B Strip */}
      <section className="container mx-auto px-4 pb-6">
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
      <section className="container mx-auto px-4 py-8 border-y border-gray-200 mt-4 pb-6">
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

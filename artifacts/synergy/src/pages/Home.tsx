import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Play, Package, Lightbulb, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { tutorialPosts } from "@/data/tutorials";
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
          className="mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorialPosts.map((tutorial) => (
            <Link
              key={tutorial.id}
              href={`/tutorials/${tutorial.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
              aria-label={`Watch: ${tutorial.title}`}
            >
              {/* Cover — same aspect ratio as blogs, no card chrome */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <img
                  src={tutorial.image}
                  alt={tutorial.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Centered play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300 ring-4 ring-white/30">
                    <Play className="h-6 w-6 text-slate-900 fill-slate-900 ml-0.5" />
                  </div>
                </div>


              </div>

              {/* Title — same editorial typography as blogs */}
              <div className="mt-5 px-1">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  <span className="h-px w-5 bg-slate-300" />
                  <span>Video Tutorial</span>
                </div>
                <h3 className="mt-3 text-base md:text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                  {tutorial.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* B2B Strip — Custom Solutions & Training Banner */}
      <section className="container mx-auto px-4 pb-6">
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
          style={{ backgroundColor: "#0f172b" }}
        >
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left content */}
            <div className="p-8 md:p-12 lg:p-14 md:w-3/5 flex flex-col justify-center">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider w-fit mb-5">
                <span>INDUSTRY & ACADEMIA</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                <span className="whitespace-nowrap">Custom Solutions <span className="text-blue-300">&amp; Hands-on</span></span>
                <span className="block text-blue-300">Training Programs</span>
              </h2>

              <p className="text-blue-50/90 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                Specialized programs in <span className="font-semibold text-white">IoT</span>, <span className="font-semibold text-white">Robotics</span>, and <span className="font-semibold text-white">Edge AI</span> — plus custom industrial implementations that bridge emerging tech with real-world applications.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 rounded-full font-bold shadow-lg shadow-blue-900/30"
                  >
                    Request a Consultation
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10 rounded-full font-semibold"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right visual — bulb with hover glow */}
            <div className="md:w-2/5 relative min-h-[280px] md:min-h-[420px] flex items-center justify-center group">
              <div className="relative flex flex-col items-center">
                {/* Bulb — proper unlit shape, glows softly on hover */}
                <div className="relative w-32 h-40 flex flex-col items-center transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(253,224,71,0.35)]">
                  {/* Glass dome — contains the centered glow effects */}
                  <div className="relative w-28 h-28">
                    {/* Outer glow rings — centered on the dome, soft on hover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-yellow-300/0 blur-3xl transition-all duration-700 group-hover:bg-yellow-300/[0.05]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-yellow-400/0 blur-2xl transition-all duration-700 group-hover:bg-yellow-400/[0.08]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-yellow-300/0 blur-xl transition-all duration-700 group-hover:bg-yellow-300/[0.12]" />

                    {/* Concentric pulse rings — centered on the dome */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-yellow-300/0 scale-75 transition-all duration-700 group-hover:border-yellow-300/[0.12] group-hover:scale-100" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-yellow-300/0 scale-75 transition-all duration-700 group-hover:border-yellow-300/[0.18] group-hover:scale-100" />

                    {/* Glowing aura behind bulb — centered on the dome */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-300/0 blur-2xl transition-all duration-700 group-hover:bg-yellow-300/[0.22]" />

                    {/* Glass dome face */}
                    <div className="relative w-28 h-28 rounded-full bg-white border-2 border-gray-300 group-hover:border-yellow-300 group-hover:bg-gradient-to-br group-hover:from-yellow-50 group-hover:to-yellow-200 flex items-center justify-center transition-all duration-700">
                      <Lightbulb
                        className="h-14 w-14 text-gray-500 group-hover:text-yellow-600 transition-colors duration-700"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* Screw base (ribbed lines) */}
                  <div className="-mt-1 flex flex-col items-center">
                    <div className="w-14 h-1.5 bg-gray-300 group-hover:bg-yellow-400 rounded-sm transition-colors duration-700" />
                    <div className="w-14 h-1.5 bg-gray-400 group-hover:bg-yellow-500 rounded-sm mt-0.5 transition-colors duration-700" />
                    <div className="w-14 h-1.5 bg-gray-400 group-hover:bg-yellow-500 rounded-sm mt-0.5 transition-colors duration-700" />
                    <div className="w-12 h-2 bg-gray-500 group-hover:bg-yellow-600 rounded-b-md mt-0.5 transition-colors duration-700" />
                  </div>
                </div>

                {/* Sparkle dots — appear on hover, positioned around the dome */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-yellow-200 opacity-0 shadow-[0_0_6px_2px_rgba(253,224,71,0.5)] transition-opacity duration-700 group-hover:opacity-70" />
                <div className="absolute top-8 left-0 w-1 h-1 rounded-full bg-yellow-100 opacity-0 shadow-[0_0_4px_1px_rgba(253,224,71,0.4)] transition-opacity duration-700 group-hover:opacity-60" />
                <div className="absolute top-20 right-0 w-1 h-1 rounded-full bg-yellow-200 opacity-0 shadow-[0_0_4px_1px_rgba(253,224,71,0.45)] transition-opacity duration-700 group-hover:opacity-70" />
                <div className="absolute top-24 left-2 w-1 h-1 rounded-full bg-yellow-100 opacity-0 shadow-[0_0_3px_1px_rgba(253,224,71,0.4)] transition-opacity duration-700 group-hover:opacity-60" />
              </div>
            </div>
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

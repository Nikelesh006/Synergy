import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, Play, Package, Lightbulb, ArrowUpRight, Cpu, Wifi, CircuitBoard, Layers, Microchip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useTutorials } from "@/hooks/useTutorials";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/layout/SectionHeader";
import BlogsSlider from "@/components/blog/BlogsSlider";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

const banners = [
  "/banner-1.jpg",
  "/banner-2.jpg",
  "/banner-3.jpg",
  "/banner-4.jpg",
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const { data: productsData } = useProducts();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: tutorialsData } = useTutorials();

  const products = productsData?.products || [];
  const categories = categoriesData || [];
  const brands = brandsData || [];
  
  const getYoutubeVideoId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return match?.[1] || "";
  };

  const tutorialPosts = useMemo(() => {
    return (tutorialsData || []).slice(0, 3).map(tutorial => {
      const videoId = getYoutubeVideoId(tutorial.youtubeUrl);
      const fallbackThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
      return {
        id: tutorial._id,
        title: tutorial.title,
        slug: tutorial.slug,
        youtubeUrl: tutorial.youtubeUrl,
        image: tutorial.thumbnailUrl || fallbackThumbnail
      };
    });
  }, [tutorialsData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const topCategories = categories.slice(0, 8);

  return (
    <div className="flex flex-col gap-10 sm:gap-16 md:gap-20 pb-10 sm:pb-16 md:pb-20">
      {/* Hero Section */}
      <section className="relative w-full aspect-[8/3] bg-gray-100 overflow-hidden pb-6">
        {banners.map((bg, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <img 
              src={getOptimizedImageUrl(bg, { width: 1920 })} 
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-8 sm:gap-y-10 md:gap-y-12">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product Spotlight Banner — Rex32 AI */}
      <section className="container mx-auto px-4 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white shadow-2xl shadow-black/40">
          {/* Decorative pattern + grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.18),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:32px_32px]"
            aria-hidden
          />
          {/* Soft top/bottom fade */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 py-10 md:px-10 md:py-12">
            {/* Left: copy */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                REX32 AI Dev Board
              </h2>

              <p className="mt-3 text-base md:text-lg text-white/70 max-w-2xl">
                Dual-core ESP32-S3 platform built for edge ML, computer vision, and always-on IoT — with on-board AI acceleration and a rich camera/microphone interface.
              </p>

              {/* Specs pills */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {[
                  "Dual-core Xtensa LX7",
                  "8 MB PSRAM",
                  "Wi-Fi + BLE 5",
                  "Camera Interface",
                  "AI Accelerator",
                ].map((p) => (
                  <li
                    key={p}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 backdrop-blur-sm"
                  >
                    <Microchip className="h-3 w-3 text-white/60" />
                    {p}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/product/esp32-ai-rex32-ai"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                >
                  View Product
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/category/iot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white/90 ring-1 ring-white/15 hover:bg-white/5 transition-colors"
                >
                  Browse Dev Boards
                </Link>
              </div>
            </div>

            {/* Right: visual cluster */}
            <div className="lg:col-span-5 hidden lg:flex justify-end">
              <div className="relative w-full max-w-sm">
                {/* Glow blob */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl opacity-70" aria-hidden />

                {/* Main card */}
                <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-md ring-1 ring-blue-400/30 p-5 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-blue-500/15 text-blue-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      REX32 AI
                    </div>
                    <Layers className="h-4 w-4 text-white/40" />
                  </div>

                  {/* Board illustration */}
                  <div className="mt-4 relative aspect-[5/3] rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 ring-1 border border-blue-400/20 overflow-hidden">
                    {/* PCB traces */}
                    <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" aria-hidden>
                      <defs>
                        <linearGradient id="trace-blue-product" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <g stroke="url(#trace-blue-product)" strokeWidth="1" fill="none">
                        <path d="M0 30 H60 L80 50 H120 L140 30 H200" />
                        <path d="M0 70 H40 L60 90 H100 L120 70 H200" />
                        <path d="M0 100 H200" />
                      </g>
                      <g fill="#60a5fa" opacity="0.9">
                        <circle cx="40" cy="30" r="2" />
                        <circle cx="80" cy="50" r="2" />
                        <circle cx="140" cy="30" r="2" />
                        <circle cx="60" cy="90" r="2" />
                        <circle cx="120" cy="70" r="2" />
                      </g>
                    </svg>
                    {/* Chip */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="h-14 w-14 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 ring-1 ring-blue-400/30 flex items-center justify-center shadow-lg">
                        <Cpu className="h-7 w-7 text-white/80" />
                      </div>
                    </div>
                    {/* Side modules */}
                    <div className="absolute left-3 top-3 h-6 w-8 rounded-sm bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20 flex items-center justify-center">
                      <CircuitBoard className="h-3.5 w-3.5" />
                    </div>
                    <div className="absolute right-3 bottom-3 h-6 w-8 rounded-sm bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20 flex items-center justify-center">
                      <Wifi className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white/[0.04] ring-1 ring-blue-400/30 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-white/50">Processor</div>
                      <div className="mt-0.5 text-sm font-semibold text-white">
                        Dual-core LX7
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] ring-1 ring-blue-400/30 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-white/50">Memory</div>
                      <div className="mt-0.5 text-lg font-bold text-blue-300">
                        8 MB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs — sliding row, advances one card at a time, loops, pauses on hover */}
      <section className="container mx-auto px-4 pb-6">
        <SectionHeader
          title="Blogs"
          action={
            <Link href="/blogs" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          }
          className="mb-10"
        />
        <BlogsSlider />
      </section>

      {/* Tutorials */}
      {tutorialPosts.length > 0 && (
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {tutorialPosts.map((tutorial) => (
              <Link
                key={tutorial.id}
                href={`/tutorials/${tutorial.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
                aria-label={`Watch: ${tutorial.title}`}
              >
                {/* Cover — compact square on mobile, normal on larger screens */}
                <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={getOptimizedImageUrl(tutorial.image, { width: 800, crop: "fill" }) || "https://placehold.co/800x450/0f172a/ffffff?text=Video+Tutorial"}
                    alt={tutorial.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://placehold.co/800x450/0f172a/ffffff?text=Video+Tutorial";
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Centered play button — smaller on mobile, full size on larger screens */}
                  <div className="flex absolute inset-0 items-center justify-center">
                    <div className="w-9 h-9 sm:w-14 sm:h-14 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300 ring-2 sm:ring-4 ring-white/30">
                      <Play className="h-4 w-4 sm:h-6 sm:w-6 text-slate-900 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Title — only title on mobile, full editorial layout on larger screens */}
                <div className="mt-2 sm:mt-5 px-1">
                  {/* Hide the "Video Tutorial" label on small mobile */}
                  <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    <span className="h-px w-5 bg-slate-300" />
                    <span>Video Tutorial</span>
                  </div>
                  <h3 className="mt-0 sm:mt-3 text-[11px] sm:text-base md:text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                    {tutorial.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* B2B Strip — Custom Solutions & Training Banner */}
      <section className="container mx-auto px-4 pb-6">
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
          style={{ backgroundColor: "#0f172b" }}
        >
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left content */}
            <div className="p-5 sm:p-8 md:p-12 lg:p-14 md:w-3/5 flex flex-col justify-center">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider w-fit mb-3 sm:mb-5">
                <span>INDUSTRY & ACADEMIA</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                <span>Custom Solutions <span className="text-blue-300">&amp; Hands-on</span></span>
                <span className="block text-blue-300">Training Programs</span>
              </h2>

              <p className="text-blue-50/90 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 max-w-xl leading-relaxed">
                Specialized programs in <span className="font-semibold text-white">IoT</span>, <span className="font-semibold text-white">Robotics</span>, and <span className="font-semibold text-white">Edge AI</span> — plus custom industrial implementations that bridge emerging tech with real-world applications.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 rounded-full font-bold shadow-lg shadow-blue-900/30 text-xs sm:text-sm h-9 sm:h-11 px-4 sm:px-6"
                  >
                    Request a Consultation
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/10 rounded-full font-semibold text-xs sm:text-sm h-9 sm:h-11 px-4 sm:px-6"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right visual — bulb with hover glow (hidden on small mobile to save space) */}
            <div className="hidden sm:flex md:w-2/5 relative min-h-[220px] md:min-h-[420px] items-center justify-center group">
              <div className="relative flex flex-col items-center">
                {/* Bulb — proper unlit shape, glows softly on hover */}
                <div className="relative w-24 sm:w-32 h-32 sm:h-40 flex flex-col items-center transition-all duration-700 group-hover:drop-shadow-[0_0_20px_rgba(253,224,71,0.35)] scale-90 sm:scale-100">
                  {/* Glass dome — contains the centered glow effects */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28">
                    {/* Outer glow rings — centered on the dome, soft on hover */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-yellow-300/0 blur-3xl transition-all duration-700 group-hover:bg-yellow-300/[0.05]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-yellow-400/0 blur-2xl transition-all duration-700 group-hover:bg-yellow-400/[0.08]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-yellow-300/0 blur-xl transition-all duration-700 group-hover:bg-yellow-300/[0.12]" />

                    {/* Concentric pulse rings — centered on the dome */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-48 h-36 sm:h-48 rounded-full border border-yellow-300/0 scale-75 transition-all duration-700 group-hover:border-yellow-300/[0.12] group-hover:scale-100" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full border border-yellow-300/0 scale-75 transition-all duration-700 group-hover:border-yellow-300/[0.18] group-hover:scale-100" />

                    {/* Glowing aura behind bulb — centered on the dome */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-yellow-300/0 blur-2xl transition-all duration-700 group-hover:bg-yellow-300/[0.22]" />

                    {/* Glass dome face */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-gray-300 group-hover:border-yellow-300 group-hover:bg-gradient-to-br group-hover:from-yellow-50 group-hover:to-yellow-200 flex items-center justify-center transition-all duration-700">
                      <Lightbulb
                        className="h-10 w-10 sm:h-14 sm:w-14 text-gray-500 group-hover:text-yellow-600 transition-colors duration-700"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* Screw base (ribbed lines) */}
                  <div className="-mt-1 flex flex-col items-center">
                    <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-gray-300 group-hover:bg-yellow-400 rounded-sm transition-colors duration-700" />
                    <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-gray-400 group-hover:bg-yellow-500 rounded-sm mt-0.5 transition-colors duration-700" />
                    <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-gray-400 group-hover:bg-yellow-500 rounded-sm mt-0.5 transition-colors duration-700" />
                    <div className="w-9 sm:w-12 h-1.5 sm:h-2 bg-gray-500 group-hover:bg-yellow-600 rounded-b-md mt-0.5 transition-colors duration-700" />
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

      {/* Trusted by industry leaders section */}
      <section className="border-y border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 py-10 sm:py-14 my-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Verified OEM & Component Partners
            </div>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900">
              Trusted by Industry Leaders & Engineering Teams
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Direct sourcing partnerships ensuring 100% genuine parts, full warranties, and factory batch tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {(brands.length > 0 ? brands.slice(0, 6) : [
              { id: "b1", name: "Havells", slug: "havells" },
              { id: "b2", name: "Legrand", slug: "legrand" },
              { id: "b3", name: "Schneider Electric", slug: "schneider" },
              { id: "b4", name: "Siemens", slug: "siemens" },
              { id: "b5", name: "ABB", slug: "abb" },
              { id: "b6", name: "Polycab", slug: "polycab" }
            ]).map((brand) => (
              <Link
                href={`/shop?brand=${brand.slug}`}
                key={brand.id}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 text-center cursor-pointer"
              >
                <span className="text-xs uppercase tracking-widest font-mono text-gray-400 group-hover:text-blue-600 transition-colors">
                  Partner
                </span>
                <span className="mt-1 text-sm sm:text-base font-extrabold tracking-tight text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                  {brand.name}
                </span>
                <span className="mt-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" /> Authorized
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

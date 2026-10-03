import { useState, useMemo } from "react";
import { Link, useParams } from "wouter";
import { Package, Cpu, Wifi, CircuitBoard, Layers, Brain, Bot, Cog, Cpu as CpuIcon, Microscope, Activity } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar, { type FilterGroup } from "@/components/layout/FilterSidebar";
import NotFound from "./not-found";

// Per-category banner content: theme color, headline, sub-points and visual badge
const categoryTheme: Record<
  string,
  {
    accent: string;          // tailwind text-color class
    ring: string;            // ring color class
    gradient: string;        // background gradient class
    chip: string;            // chip background class
    pattern: string;         // decorative bg class
    eyebrow: string;         // small label above headline
    headline: string;        // main banner headline
    sub: string;             // short supporting line
    points: string[];        // 3 quick feature bullets
    stat: { label: string; value: string }; // highlight stat
  }
> = {
  iot: {
    accent: "text-blue-600",
    ring: "ring-blue-500/20",
    gradient: "from-slate-950 via-blue-950 to-slate-900",
    chip: "bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.18),transparent_50%)]",
    eyebrow: "Internet of Things",
    headline: "Build connected products, faster.",
    sub: "Wi-Fi & BLE enabled boards, modules and gateways engineered for production-grade IoT.",
    points: ["Wi-Fi + Bluetooth", "Low-power MCUs", "Cloud-ready firmware"],
    stat: { label: "Boards & modules", value: "20+" },
  },
  ai: {
    accent: "text-violet-600",
    ring: "ring-violet-500/20",
    gradient: "from-slate-950 via-violet-950 to-slate-900",
    chip: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.18),transparent_50%)]",
    eyebrow: "Edge AI & Machine Learning",
    headline: "Run ML models on the device, not the cloud.",
    sub: "High-performance SoCs, neural accelerators and developer kits for on-device inference, vision and audio.",
    points: ["Edge inference", "NPU-equipped SoCs", "Vision & audio ready"],
    stat: { label: "AI dev boards", value: "10+" },
  },
  "development-boards": {
    accent: "text-emerald-600",
    ring: "ring-emerald-500/20",
    gradient: "from-slate-950 via-emerald-950 to-slate-900",
    chip: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(20,184,166,0.18),transparent_50%)]",
    eyebrow: "Embedded Systems",
    headline: "Deterministic boards for production firmware.",
    sub: "Industrial-grade MCUs, real-time controllers and starter kits engineered for embedded product development.",
    points: ["RTOS & bare-metal", "Long-life MCUs", "Industrial temperature range"],
    stat: { label: "Embedded boards", value: "30+" },
  },
  robotics: {
    accent: "text-amber-600",
    ring: "ring-amber-500/20",
    gradient: "from-slate-950 via-amber-950 to-slate-900",
    chip: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.20),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(234,88,12,0.16),transparent_50%)]",
    eyebrow: "Robotics",
    headline: "Motion control, motor drivers and controllers.",
    sub: "Servo and stepper drivers, motor controllers and complete robotics platforms for prototypes and production lines.",
    points: ["Servo & stepper", "Real-time control", "ROS-compatible platforms"],
    stat: { label: "Robotics parts", value: "25+" },
  },
  "lab-equipments": {
    accent: "text-indigo-600",
    ring: "ring-indigo-500/20",
    gradient: "from-slate-950 via-indigo-950 to-slate-900",
    chip: "bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.16),transparent_50%)]",
    eyebrow: "Lab Equipments",
    headline: "Calibrated instruments for engineering labs.",
    sub: "Bench meters, oscilloscopes, power supplies and trainers used in academic and R&D labs across the curriculum.",
    points: ["Calibrated & traceable", "Curriculum-aligned", "Trainer modules available"],
    stat: { label: "Lab instruments", value: "15+" },
  },
  "sensors-instrumentation-mr3461": {
    accent: "text-cyan-600",
    ring: "ring-cyan-500/20",
    gradient: "from-slate-950 via-cyan-950 to-slate-900",
    chip: "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/30",
    pattern:
      "bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(45,212,191,0.16),transparent_50%)]",
    eyebrow: "Sensors & Instrumentation",
    headline: "Measure, sense and observe with precision.",
    sub: "Strain gauges, LVDTs, temperature and pressure sensors, plus DAQ modules for the MR3461 curriculum and beyond.",
    points: ["LVDT & strain gauges", "DAQ-ready modules", "MR3461 curriculum aligned"],
    stat: { label: "Sensor modules", value: "15+" },
  },
};

const categoryImages: Record<string, string> = {
  iot: "/categories/iot-boards.jpg",
  ai: "/categories/ai-boards.jpg",
  robotics: "/categories/robotics-boards.jpg",
  "embedded-systems-boards": "/categories/embedded-boards.jpg",
  "development-boards": "/categories/embedded-boards.jpg",
  "lab-equipments": "/categories/lab-equipments.jpg",
  "sensors-instrumentation-mr3461": "/categories/lab-equipments.jpg",
};

// Sensible default for any other category so the banner still looks great
const defaultTheme = {
  accent: "text-slate-300",
  ring: "ring-slate-500/20",
  gradient: "from-slate-950 via-slate-900 to-slate-800",
  chip: "bg-slate-500/10 text-slate-300 ring-1 ring-slate-400/30",
  pattern:
    "bg-[radial-gradient(circle_at_20%_30%,rgba(148,163,184,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(100,116,139,0.14),transparent_50%)]",
  eyebrow: "Synergy Tech Labs",
  headline: "Industrial-grade components, ready to ship.",
  sub: "Hand-picked development boards, modules and accessories for engineers who ship.",
  points: ["Curated catalog", "Bulk pricing", "Fast delivery"],
  stat: { label: "Products available", value: "500+" },
};

export default function Category() {
  const { slug } = useParams();
  
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);

  const categories = categoriesData || [];
  const products = productsData?.products || [];

  const category = categories.find(c => c.slug === slug);

  const categoryProducts = category ? products.filter(p => p.category === category.name) : [];
  const subcategories = Array.from(new Set(categoryProducts.map(p => p.subcategory).filter(Boolean))) as string[];
  const brands = Array.from(new Set(categoryProducts.map(p => p.brand).filter(Boolean))) as string[];
  const theme = categoryTheme[slug || ""] ?? defaultTheme;
  const hasCustomTheme = slug ? Object.prototype.hasOwnProperty.call(categoryTheme, slug) : false;

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryProducts.forEach((p) => {
      if (p.subcategory) counts[p.subcategory] = (counts[p.subcategory] ?? 0) + 1;
    });
    return counts;
  }, [categoryProducts]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryProducts.forEach((p) => {
      if (p.brand) counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    });
    return counts;
  }, [categoryProducts]);

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!category) return <NotFound />;

  const toggle = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filterGroups: FilterGroup[] = [
    ...(subcategories.length > 0
      ? [
          {
            id: "subcategories",
            title: "Subcategories",
            defaultOpen: true,
            options: subcategories.map((s) => ({
              value: s,
              label: s,
              count: subcategoryCounts[s] ?? 0,
            })),
          },
        ]
      : []),
    ...(brands.length > 0
      ? [
          {
            id: "brands",
            title: "Brand",
            defaultOpen: true,
            options: brands.map((b) => ({
              value: b,
              label: b,
              count: brandCounts[b] ?? 0,
            })),
          },
        ]
      : []),
    {
      id: "availability",
      title: "Availability",
      defaultOpen: false,
      options: [
        { value: "in-stock", label: "In stock" },
        { value: "on-sale", label: "On sale" },
        { value: "new", label: "New arrivals" },
      ],
    },
  ];

  const allSelected = [...selectedSubcategories, ...selectedBrands, ...selectedAvailability];

  const resetAll = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSelectedAvailability([]);
  };

  const onToggleSelected = (groupId: string, value: string) => {
    if (groupId === "subcategories") toggle(value, selectedSubcategories, setSelectedSubcategories);
    else if (groupId === "brands") toggle(value, selectedBrands, setSelectedBrands);
    else if (groupId === "availability") toggle(value, selectedAvailability, setSelectedAvailability);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Category Hero */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} text-white mb-8`}
      >
        {/* Decorative pattern + grid */}
        <div className={`absolute inset-0 ${theme.pattern}`} />
        <div
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:32px_32px]"
          aria-hidden
        />
        {/* Soft top/bottom fade so content sits on it cleanly */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />

        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/30">/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Categories</Link>
            <span className="mx-2 text-white/30">/</span>
            <span className="text-white/90 font-medium">{category.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: copy */}
            <div className="lg:col-span-7">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${theme.chip}`}>
                <Wifi className="h-3.5 w-3.5" />
                {theme.eyebrow}
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                {theme.headline}
              </h1>

              <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl">
                {theme.sub}
              </p>

              {/* Feature pills */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {theme.points.map((p) => (
                  <li
                    key={p}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 backdrop-blur-sm"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual cluster */}
            <div className="lg:col-span-5 hidden lg:flex justify-end">
              <CategoryVisual
                themeKey={slug || ""}
                hasCustomTheme={hasCustomTheme}
                stat={theme.stat}
                productCount={categoryProducts.length}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <FilterSidebar
            groups={filterGroups}
            selected={allSelected}
            onToggle={(value) => {
              const group = filterGroups.find((g) => g.options.some((o) => o.value === value));
              if (group) onToggleSelected(group.id, value);
            }}
            onReset={resetAll}
          />

          {/* Main Content */}
          <main id="products" className="flex-1">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-8 sm:gap-y-10 md:gap-y-12 mb-8">
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

// Decorative visual cluster for the right side of the category banner.
// Pure SVG + lucide icons — no external assets — so it matches any category.
function CategoryVisual({
  themeKey,
  hasCustomTheme,
  stat,
  productCount,
}: {
  themeKey: string;
  hasCustomTheme: boolean;
  stat: { label: string; value: string };
  productCount: number;
}) {
  // Per-category color tokens for the visual card. Keys match categoryTheme.
  const palette: Record<
    string,
    { ring: string; iconBg: string; border: string; gradFrom: string; gradTo: string; trace: [string, string]; dot: string; stat: string; dotPulse: string; ChipIcon: typeof Cpu }
  > = {
    iot: {
      ring: "ring-blue-400/30",
      iconBg: "bg-blue-500/15 text-blue-300",
      border: "border-blue-400/20",
      gradFrom: "from-blue-500/20",
      gradTo: "to-cyan-500/20",
      trace: ["#3b82f6", "#22d3ee"],
      dot: "#60a5fa",
      dotPulse: "bg-blue-400",
      stat: "text-blue-300",
      ChipIcon: Wifi,
    },
    ai: {
      ring: "ring-violet-400/30",
      iconBg: "bg-violet-500/15 text-violet-300",
      border: "border-violet-400/20",
      gradFrom: "from-violet-500/20",
      gradTo: "to-fuchsia-500/20",
      trace: ["#8b5cf6", "#d946ef"],
      dot: "#c4b5fd",
      dotPulse: "bg-violet-400",
      stat: "text-violet-300",
      ChipIcon: Brain,
    },
    "development-boards": {
      ring: "ring-emerald-400/30",
      iconBg: "bg-emerald-500/15 text-emerald-300",
      border: "border-emerald-400/20",
      gradFrom: "from-emerald-500/20",
      gradTo: "to-teal-500/20",
      trace: ["#10b981", "#14b8a6"],
      dot: "#6ee7b7",
      dotPulse: "bg-emerald-400",
      stat: "text-emerald-300",
      ChipIcon: CpuIcon,
    },
    robotics: {
      ring: "ring-amber-400/30",
      iconBg: "bg-amber-500/15 text-amber-300",
      border: "border-amber-400/20",
      gradFrom: "from-amber-500/20",
      gradTo: "to-orange-500/20",
      trace: ["#f59e0b", "#f97316"],
      dot: "#fcd34d",
      dotPulse: "bg-amber-400",
      stat: "text-amber-300",
      ChipIcon: Bot,
    },
    "lab-equipments": {
      ring: "ring-indigo-400/30",
      iconBg: "bg-indigo-500/15 text-indigo-300",
      border: "border-indigo-400/20",
      gradFrom: "from-indigo-500/20",
      gradTo: "to-sky-500/20",
      trace: ["#6366f1", "#0ea5e9"],
      dot: "#a5b4fc",
      dotPulse: "bg-indigo-400",
      stat: "text-indigo-300",
      ChipIcon: Microscope,
    },
    "sensors-instrumentation-mr3461": {
      ring: "ring-cyan-400/30",
      iconBg: "bg-cyan-500/15 text-cyan-300",
      border: "border-cyan-400/20",
      gradFrom: "from-cyan-500/20",
      gradTo: "to-teal-500/20",
      trace: ["#06b6d4", "#14b8a6"],
      dot: "#67e8f9",
      dotPulse: "bg-cyan-400",
      stat: "text-cyan-300",
      ChipIcon: Activity,
    },
  };

  // Fall back to a neutral slate palette for categories without a custom theme.
  const fallback = {
    ring: "ring-slate-400/30",
    iconBg: "bg-slate-500/15 text-slate-300",
    border: "border-slate-400/20",
    gradFrom: "from-slate-500/20",
    gradTo: "to-slate-400/20",
    trace: ["#94a3b8", "#cbd5e1"] as [string, string],
    dot: "#cbd5e1",
    dotPulse: "bg-slate-400",
    stat: "text-slate-300",
    ChipIcon: Cpu,
  };
  const t = (hasCustomTheme ? palette[themeKey] : undefined) ?? fallback;
  const gradientId = `trace-${themeKey || "default"}`;
  const chipLabel = hasCustomTheme ? themeKey.replace(/-/g, " ") : "Catalog";

  return (
    <div className="relative w-full max-w-sm">
      {/* Glow blob */}
      <div
        className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${t.gradFrom} ${t.gradTo} blur-2xl opacity-70`}
        aria-hidden
      />

      {/* Main card */}
      <div className={`relative rounded-2xl bg-white/[0.04] backdrop-blur-md ring-1 ${t.ring} p-5 shadow-2xl`}>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${t.iconBg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${t.dotPulse} animate-pulse`} />
            {chipLabel}
          </div>
          <Layers className="h-4 w-4 text-white/40" />
        </div>

        {/* Board illustration / photo */}
        <div className={`mt-4 relative aspect-[5/3] rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 ring-1 border ${t.border} overflow-hidden group`}>
          {categoryImages[themeKey] ? (
            <div className="relative w-full h-full">
              <img
                src={categoryImages[themeKey]}
                alt={chipLabel}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />
            </div>
          ) : (
            <>
              {/* PCB traces */}
              <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" aria-hidden>
                <defs>
                  <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor={t.trace[0]} stopOpacity="0" />
                    <stop offset="50%" stopColor={t.trace[0]} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={t.trace[1]} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke={`url(#${gradientId})`} strokeWidth="1" fill="none">
                  <path d="M0 30 H60 L80 50 H120 L140 30 H200" />
                  <path d="M0 70 H40 L60 90 H100 L120 70 H200" />
                  <path d="M0 100 H200" />
                </g>
                <g fill={t.dot} opacity="0.9">
                  <circle cx="40" cy="30" r="2" />
                  <circle cx="80" cy="50" r="2" />
                  <circle cx="140" cy="30" r="2" />
                  <circle cx="60" cy="90" r="2" />
                  <circle cx="120" cy="70" r="2" />
                </g>
              </svg>
              {/* Chip */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`h-14 w-14 rounded-md bg-gradient-to-br from-slate-700 to-slate-900 ring-1 ${t.border} flex items-center justify-center shadow-lg`}>
                  <t.ChipIcon className="h-7 w-7 text-white/80" />
                </div>
              </div>
              {/* Side modules */}
              <div className={`absolute left-3 top-3 h-6 w-8 rounded-sm ${t.iconBg} ring-1 ${t.border} flex items-center justify-center`}>
                <CircuitBoard className="h-3.5 w-3.5" />
              </div>
              <div className={`absolute right-3 bottom-3 h-6 w-8 rounded-sm ${t.iconBg} ring-1 ${t.border} flex items-center justify-center`}>
                <Wifi className="h-3.5 w-3.5" />
              </div>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`rounded-lg bg-white/[0.04] ring-1 ${t.ring} px-3 py-2.5`}>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Listed</div>
            <div className="mt-0.5 text-lg font-bold text-white">
              {productCount > 0 ? productCount : "—"}{" "}
              <span className="text-xs font-medium text-white/50">products</span>
            </div>
          </div>
          <div className={`rounded-lg bg-white/[0.04] ring-1 ${t.ring} px-3 py-2.5`}>
            <div className="text-[10px] uppercase tracking-wider text-white/50">{stat.label}</div>
            <div className={`mt-0.5 text-lg font-bold ${t.stat}`}>
              {stat.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

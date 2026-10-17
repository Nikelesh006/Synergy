import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, User, Heart, ShoppingCart, Cpu, Flame, Menu, X, ChevronDown, LogOut, Package, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MegaMenu from "./MegaMenu";
import { useStore } from "@/context/StoreContext";
import { adminLinks } from "@/components/admin/AdminNav";
import { useProducts } from "@/hooks/useProducts";
import { getProductDisplayImage } from "@/lib/productImage";
import { Product } from "@/types";

const SEARCH_PHRASES = [
  "AI Development Boards",
  "Rex32",
  "Arduino Boards",
  "ESP32 Servo Drivers",
  "DC Drivers",
  "Embedded Systems Development Boards",
  "Robotics Development Boards",
  "Lab Equipments",
  "ESP32 Stepper Drivers",
];

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const isAtEnd = !isDeleting && text === current;
    const isAtStart = isDeleting && text === "";
    const typingSpeed = isDeleting ? 50 : 120;
    const pauseAtEnd = 2200;
    const pauseAtStart = 600;

    let delay = typingSpeed;
    if (isAtEnd) delay = pauseAtEnd;
    else if (isAtStart) delay = pauseAtStart;

    const timer = window.setTimeout(() => {
      if (isAtEnd) {
        setIsDeleting(true);
        return;
      }
      if (isAtStart) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }
      setText(
        isDeleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases]);

  return text;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { cartCount, wishlist, openAuth, user, isAdmin, logout } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const desktopSearchContainerRef = useRef<HTMLFormElement | null>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement | null>(null);

  const desktopPlaceholder = useTypewriter(SEARCH_PHRASES);
  const mobilePlaceholder = useTypewriter(SEARCH_PHRASES);

  // Fetch product catalog for instant search suggestions
  const { data: productsData } = useProducts();
  const allProducts = useMemo(() => productsData?.products || [], [productsData]);

  // Sync search input with URL when visiting /shop?search=...
  useEffect(() => {
    if (typeof window !== "undefined" && location.startsWith("/shop")) {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search") || params.get("q") || "";
      setSearchQuery(q);
    }
  }, [location]);

  // Filter instant suggestions (top 5 matches)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return allProducts.filter((p: Product) =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.subcategory?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, allProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchContainerRef.current && !desktopSearchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(e.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const controlNavbar = () => {
      if (isMobileMenuOpen) {
        // Keep header visible while the mobile menu is open
        setIsVisible(true);
        return;
      }
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, isMobileMenuOpen]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu and search dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    if (q) {
      setLocation(`/shop?search=${encodeURIComponent(q)}`);
    } else {
      setLocation("/shop");
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${isMobileMenuOpen || isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-3 sm:px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-3 sm:py-4 gap-2 sm:gap-4 md:gap-8">

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-1.5 -ml-1 text-gray-700 shrink-0"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/synergy-logo.png" alt="Synergy" draggable={false} onDragStart={(e) => e.preventDefault()} className="h-9 sm:h-10 md:h-12 w-auto select-none scale-125 md:scale-130" />
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            ref={desktopSearchContainerRef}
            onSubmit={handleSearch}
            className="relative hidden md:flex flex-1 max-w-2xl items-center border border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 rounded-full shadow-md transition-all bg-white"
          >
            <div className="flex items-center flex-1 rounded-full overflow-hidden">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder={searchFocused ? "" : `Search for ${desktopPlaceholder}`}
                onFocus={() => {
                  setSearchFocused(true);
                  if (searchQuery.trim().length >= 1) setIsDropdownOpen(true);
                }}
                onBlur={() => setSearchFocused(false)}
                className="border-0 rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-5 py-6 text-sm text-gray-800 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button type="submit" variant="secondary" className="rounded-none px-6 h-[48px] shadow-none bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* Live Search Instant Results Dropdown */}
            {isDropdownOpen && searchQuery.trim().length >= 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Suggested Products</span>
                      <span className="text-blue-600 font-semibold">{searchResults.length} {searchResults.length === 1 ? "match" : "matches"}</span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[360px] overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug || product.id}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3.5 px-4 py-3 hover:bg-blue-50/60 transition-colors group cursor-pointer"
                        >
                          <img
                            src={getProductDisplayImage(product.images?.[0], product.category, product.subcategory)}
                            alt={product.name}
                            className="h-11 w-11 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200/80"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/categories/embedded-boards.jpg";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 font-medium">{product.category}</span>
                              {product.sku && <span className="font-mono text-gray-400">SKU: {product.sku}</span>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-gray-900">₹{product.price.toLocaleString("en-IN")}</p>
                            {product.inStock ? (
                              <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-medium">Pre-order</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center justify-center gap-1.5 w-full py-1"
                      >
                        <span>View all results for "{searchQuery}"</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-800">No products found for "{searchQuery}"</p>
                    <p className="text-[11px] text-gray-500 mt-1">Try searching for ESP32, Arduino, Raspberry Pi, or Sensors</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setLocation("/shop");
                      }}
                      className="mt-3 text-xs font-semibold text-blue-600 hover:underline inline-block"
                    >
                      Browse all products &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-6 flex-shrink-0">
            {isAdmin && (
              <Link
                href="/admin/add-product"
                className="hidden sm:flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            )}

            {user ? (
              <Link
                href="/account"
                className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1"
                aria-label="My Account"
                title="My Account"
              >
                <User className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuth("signin")}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1"
                aria-label="Sign in"
              >
                <User className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            )}

            <Link href="/wishlist" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors p-1">
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-1 sm:-top-1 sm:-right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div ref={mobileSearchContainerRef} className="relative md:hidden pb-3 sm:pb-4">
          <form onSubmit={handleSearch} className="flex border border-gray-300 focus-within:border-blue-600 rounded-full overflow-hidden shadow-md bg-white">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMobileDropdownOpen(true);
              }}
              placeholder={searchFocused ? "" : `Search for ${mobilePlaceholder}`}
              onFocus={() => {
                setSearchFocused(true);
                if (searchQuery.trim().length >= 1) setIsMobileDropdownOpen(true);
              }}
              onBlur={() => setSearchFocused(false)}
              className="border-0 rounded-none shadow-none focus-visible:ring-0 h-10 text-sm px-4"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsMobileDropdownOpen(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <Button type="submit" variant="secondary" className="rounded-none px-3 sm:px-4 h-10 shadow-none bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </form>

          {/* Mobile Instant Results Dropdown */}
          {isMobileDropdownOpen && searchQuery.trim().length >= 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div>
                  <div className="divide-y divide-gray-50 max-h-[280px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        onClick={() => setIsMobileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50/60 transition-colors"
                      >
                        <img
                          src={getProductDisplayImage(product.images?.[0], product.category, product.subcategory)}
                          alt={product.name}
                          className="h-9 w-9 rounded-md object-cover bg-gray-100 shrink-0 border border-gray-200/80"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-500">{product.category}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-900 shrink-0">₹{product.price.toLocaleString("en-IN")}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center justify-center gap-1 w-full"
                    >
                      <span>View all matching results</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-semibold text-gray-800">No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <div className="hidden md:block border-t border-gray-200">
        <MegaMenu />
      </div>

      {/* Mobile Menu (rendered via portal at document.body) */}
      <MobileMenu
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onSignIn={() => openAuth("signin")}
      />
    </header>
  );
}

/**
 * Mobile menu rendered via a React portal so it lives at the document body,
 * outside the sticky/transformed header. This guarantees the `fixed inset-0`
 * overlay is positioned relative to the viewport, not the (possibly
 * translated) header.
 */
function MobileMenu({
  open,
  onClose,
  onSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin } = useStore();
  // Track which parent sections are expanded (mirrors the desktop hover dropdowns)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    development: false,
    lab: false,
    blogs: false,
    admin: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset all dropdowns whenever the menu is opened fresh
  useEffect(() => {
    if (open) {
      setOpenSections({ development: false, lab: false, blogs: false, admin: false });
    }
  }, [open]);

  if (!mounted || !open) return null;
  if (typeof document === 'undefined') return null;

  const toggleSection = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/50 md:hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div
        className="w-[85%] max-w-sm h-full bg-white shadow-xl flex flex-col mobile-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white text-gray-900 shrink-0">
          <div className="flex items-center gap-2">
            <img src="/synergy-logo.png" alt="Synergy" draggable={false} onDragStart={(e) => e.preventDefault()} className="h-9 sm:h-10 w-auto select-none scale-125" />
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 -mr-1" aria-label="Close menu">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 sm:py-4 overscroll-contain">
          {user ? (
            <Link
              href="/account"
              className="block w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-b border-gray-100 text-left flex items-center gap-3"
              onClick={onClose}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span>{user.name}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="block w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-b border-gray-100 text-left"
            >
              Sign in / Create account
            </button>
          )}
          <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={onClose}>Home</Link>

          {/* Development boards — same sub-sections as desktop MegaMenu */}
          <MobileSection
            label="Development boards"
            isOpen={openSections.development}
            onToggle={() => toggleSection('development')}
            onClose={onClose}
            items={[
              { href: "/category/iot", label: "IoT" },
              { href: "/category/ai", label: "AI" },
              { href: "/category/embedded-systems-boards", label: "Embedded Systems" },
              { href: "/category/robotics", label: "Robotics" },
            ]}
          />

          {/* Lab equipments — same sub-sections as desktop MegaMenu */}
          <MobileSection
            label="Lab equipments"
            isOpen={openSections.lab}
            onToggle={() => toggleSection('lab')}
            onClose={onClose}
            items={[
              { href: "/category/sensors-instrumentation-mr3461", label: "Sensors and Instrumentation (MR3461)" },
            ]}
            divider
          />

          {/* Blogs — same sub-sections as desktop MegaMenu */}
          <MobileSection
            label="Blogs"
            isOpen={openSections.blogs}
            onToggle={() => toggleSection('blogs')}
            onClose={onClose}
            items={[
              { href: "/blogs", label: "Blogs" },
              { href: "/tutorials", label: "Tutorials" },
            ]}
            divider
          />

          {/* Admin — collapsible like the other dropdowns */}
          {isAdmin && (
            <MobileSection
              label="Admin"
              isOpen={openSections.admin}
              onToggle={() => toggleSection('admin')}
              onClose={onClose}
              items={adminLinks.map((item) => ({
                href: item.href,
                label: item.label,
              }))}
            />
          )}

          <Link href="/about" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={onClose}>About us</Link>
          <Link href="/faq" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={onClose}>FAQ</Link>
          <Link href="/shop" className="block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-b border-gray-100" onClick={onClose}>All products</Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Collapsible section inside the mobile menu — mirrors the dropdowns that
 * appear on hover in the desktop MegaMenu so the IA stays consistent across
 * viewports.
 */
function MobileSection({
  label,
  items,
  isOpen,
  onToggle,
  onClose,
  divider = false,
}: {
  label: string;
  items: { href: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  divider?: boolean;
}) {
  return (
    <div className={divider ? "border-b border-gray-100" : ""}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-left"
      >
        <span className="capitalize">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <ul className="pb-1.5">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block pl-8 pr-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

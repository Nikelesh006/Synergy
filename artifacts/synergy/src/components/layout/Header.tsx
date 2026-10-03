import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, User, Heart, ShoppingCart, Cpu, Flame, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MegaMenu from "./MegaMenu";
import { useStore } from "@/context/StoreContext";
import { adminLinks } from "@/components/admin/AdminNav";

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
  const desktopPlaceholder = useTypewriter(SEARCH_PHRASES);
  const mobilePlaceholder = useTypewriter(SEARCH_PHRASES);

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/shop");
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
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center border border-gray-300 rounded-full overflow-hidden shadow-md transition-all">
            <Input
              type="search"
              placeholder={searchFocused ? "" : `Search for ${desktopPlaceholder}`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="border-0 rounded-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-6"
            />
            <Button type="submit" variant="secondary" className="rounded-none px-6 h-[48px] shadow-md">
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-6 flex-shrink-0">
            {isAdmin && (
              <div className="group relative hidden sm:block">
                <Link href="/admin/add-product" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6" />
                </Link>
                {/* Hover bridge so the cursor stays in the group while moving down to the panel */}
                <div className="absolute top-full left-0 pt-3 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                  <div
                    className="w-52 origin-top-left rounded-xl border border-gray-100 bg-white/95 p-2 shadow-lg shadow-gray-900/5 ring-1 ring-black/5 backdrop-blur-sm
                               opacity-0 -translate-y-1 scale-[0.98]
                               transition-all duration-200 ease-out
                               group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                  >
                    {adminLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group/item flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors duration-150 hover:text-blue-600"
                        >
                          <Icon className="h-4 w-4 text-gray-400 transition-colors group-hover/item:text-blue-600" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {user ? (
              <div className="relative group">
                <Link
                  href="/account"
                  className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors p-1"
                  aria-label="Go to profile"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-5 w-5 md:h-6 md:w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
                {/* User Dropdown */}
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1">
                  <div className="px-3.5 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800 truncate">{user.name || "User"}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <User className="h-3.5 w-3.5" />
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              </div>
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
        <div className="md:hidden pb-3 sm:pb-4">
          <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-full overflow-hidden shadow-md">
            <Input
              type="search"
              placeholder={searchFocused ? "" : `Search for ${mobilePlaceholder}`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="border-0 rounded-none shadow-none focus-visible:ring-0 h-10 text-sm"
            />
            <Button type="submit" variant="secondary" className="rounded-none px-3 sm:px-4 h-10 shadow-md">
              <Search className="h-4 w-4" />
            </Button>
          </form>
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

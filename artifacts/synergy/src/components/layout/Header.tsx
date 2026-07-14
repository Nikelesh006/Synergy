import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, User, Heart, ShoppingCart, Cpu, Flame, Menu, X } from "lucide-react";
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
  const [, setLocation] = useLocation();
  const { cartCount, wishlist, openAuth } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const desktopPlaceholder = useTypewriter(SEARCH_PHRASES);
  const mobilePlaceholder = useTypewriter(SEARCH_PHRASES);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const controlNavbar = () => {
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
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/shop");
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-4 gap-4 md:gap-8">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -ml-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/synergy-logo.png" alt="Synergy" draggable={false} onDragStart={(e) => e.preventDefault()} className="h-10 md:h-12 w-auto select-none scale-125 md:scale-130" />
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
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
            <div className="group relative">
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

            <button
              type="button"
              onClick={() => openAuth("signin")}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Sign in"
            >
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <Link href="/wishlist" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-full overflow-hidden shadow-md">
            <Input
              type="search"
              placeholder={searchFocused ? "" : `Search for ${mobilePlaceholder}`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="border-0 rounded-none shadow-none focus-visible:ring-0"
            />
            <Button type="submit" variant="secondary" className="rounded-none px-4 shadow-md">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <div className="hidden md:block border-t border-gray-200">
        <MegaMenu />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white text-gray-900">
              <div className="flex items-center gap-2">
                <img src="/synergy-logo.png" alt="Synergy" draggable={false} onDragStart={(e) => e.preventDefault()} className="h-10 w-auto select-none scale-125" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("signin");
                }}
                className="block w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border-b border-gray-100 text-left"
              >
                Sign in / Create account
              </button>
              <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              
              <div className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Development Boards</div>
              <Link href="/category/iot" className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>IOT</Link>
              <Link href="/category/ai" className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>AI</Link>
              <Link href="/category/robotics" className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Robotics</Link>
              <Link href="/category/embedded-systems-boards" className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Embedded Systems Boards</Link>
              
              <Link href="/category/lab-equipments" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Lab Equipments</Link>
              <div className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</div>
              {adminLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block pl-8 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/blogs" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
              <Link href="/about" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/faq" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/shop" className="block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

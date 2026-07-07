import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, User, Heart, ShoppingCart, Cpu, Flame, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MegaMenu from "./MegaMenu";
import { useStore } from "@/context/StoreContext";
import { categories } from "@/data/categories";
import { adminLinks } from "@/components/admin/AdminNav";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { cartCount, wishlist } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
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
            <img src="/synergy-logo.png" alt="Synergy" className="h-12 md:h-16 w-auto" />
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <select className="bg-gray-50 border-r border-gray-300 py-2.5 px-3 text-sm text-gray-700 outline-none w-40 flex-shrink-0 cursor-pointer">
              <option value="">All Categories</option>
              {categories.slice(0, 10).map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <Input 
              type="search" 
              placeholder="Search by product name, brand, or SKU..." 
              className="border-0 rounded-none shadow-none focus-visible:ring-0 px-4 py-6"
            />
            <Button type="submit" variant="secondary" className="rounded-none px-6 h-[48px]">
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
            <Link href="/account" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-[10px] font-medium hidden md:block">Account</span>
            </Link>

            <div className="group relative">
              <Link href="/admin/add-product" className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
                <LayoutDashboard className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-[10px] font-medium hidden md:block">Admin</span>
              </Link>
              <div className="invisible absolute right-0 top-full z-50 mt-3 w-48 translate-y-2 rounded-md border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {adminLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <Link href="/wishlist" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[10px] font-medium hidden md:block">Wishlist</span>
            </Link>

            <Link href="/cart" className="relative flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] font-medium hidden md:block">Cart</span>
            </Link>
          </div>
        </div>
        
        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-md overflow-hidden">
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="border-0 rounded-none shadow-none focus-visible:ring-0"
            />
            <Button type="submit" variant="secondary" className="rounded-none px-4">
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
                <img src="/synergy-logo.png" alt="Synergy" className="h-10 w-auto" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
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

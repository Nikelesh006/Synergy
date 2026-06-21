import { Link } from "wouter";
import { categories } from "@/data/categories";

export default function MegaMenu() {
  const topCategories = categories.slice(0, 8);
  
  return (
    <div className="container mx-auto px-4">
      <ul className="flex items-center gap-1">
        {topCategories.map(cat => (
          <li key={cat.id} className="group relative">
            <Link 
              href={`/category/${cat.slug}`}
              className="block py-3 px-3 text-[13px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide uppercase"
            >
              {cat.name}
            </Link>
            {/* Simple dropdown for now - can be expanded to full mega menu */}
            <div className="absolute top-full left-0 w-64 bg-white shadow-lg border border-gray-200 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-2">
                <Link href={`/category/${cat.slug}`} className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                  View All {cat.name}
                </Link>
              </div>
            </div>
          </li>
        ))}
        <li>
          <Link 
            href="/shop"
            className="block py-3 px-3 text-[13px] font-semibold text-red-600 hover:text-red-700 transition-colors tracking-wide uppercase"
          >
            All Products
          </Link>
        </li>
      </ul>
    </div>
  );
}

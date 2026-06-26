import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

export default function MegaMenu() {
  return (
    <div className="container mx-auto px-4">
      <ul className="flex items-center justify-center gap-3 lg:gap-6 w-full">
        <li>
          <Link href="/" className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Home
          </Link>
        </li>
        <li className="group relative">
          <Link href="/category/development-boards" className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Development boards
            <ChevronDown className="h-4 w-4" />
          </Link>
          <div className="absolute top-full left-0 w-64 bg-white shadow-lg border border-gray-200 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-2">
              <Link href="/category/iot" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                IoT
              </Link>
              <Link href="/category/ai" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                AI
              </Link>
              <Link href="/category/robotics" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm capitalize">
                Robotics
              </Link>
              <Link href="/category/embedded-systems-boards" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm capitalize">
                Embedded systems boards
              </Link>
            </div>
          </div>
        </li>
        <li>
          <Link href="/category/lab-equipments" className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Lab equipments
          </Link>
        </li>
        <li className="group relative">
          <Link href="/blogs" className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Blogs
            <ChevronDown className="h-4 w-4" />
          </Link>
          <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-200 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-2">
              <Link href="/blogs" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm capitalize">
                Blogs
              </Link>
              <Link href="/tutorials" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm capitalize">
                Tutorials
              </Link>
            </div>
          </div>
        </li>
        <li>
          <Link href="/about" className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            About us
          </Link>
        </li>
        <li>
          <Link href="/contact" className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/faq" className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide">
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/shop" className="block py-3 px-3 text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors tracking-wide capitalize">
            All products
          </Link>
        </li>
      </ul>
    </div>
  );
}

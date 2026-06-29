import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { adminLinks } from "@/components/admin/AdminNav";

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
            <div className="p-2 flex flex-col gap-1">
              <Link href="/category/iot" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                IoT
              </Link>
              <Link href="/category/ai" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                AI
              </Link>
              <Link href="/category/embedded-systems-boards" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                Embedded Systems
              </Link>
              <Link href="/category/robotics" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                Robotics
              </Link>
            </div>
          </div>
        </li>
        <li className="group relative">
          <Link href="/category/lab-equipments" className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Lab equipments
            <ChevronDown className="h-4 w-4" />
          </Link>
          <div className="absolute top-full left-0 w-72 bg-white shadow-lg border border-gray-200 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-2">
              <Link href="/category/sensors-instrumentation-mr3461" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                Sensors and Instrumentation (MR3461)
              </Link>
            </div>
          </div>
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
        <li className="group relative">
          <Link href="/admin/add-product" className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize">
            Admin
            <ChevronDown className="h-4 w-4" />
          </Link>
          <div className="absolute top-full right-0 w-52 bg-white shadow-lg border border-gray-200 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-2 flex flex-col gap-1">
              {adminLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-sm">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
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

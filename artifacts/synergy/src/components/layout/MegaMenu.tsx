import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

export default function MegaMenu() {
  return (
    <div className="container mx-auto px-4">
      <ul className="flex items-center justify-center gap-1 lg:gap-2 w-full">
        <li>
          <Link
            href="/"
            className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize"
          >
            Home
          </Link>
        </li>

        {/* Development boards */}
        <li className="group relative">
          <Link
            href="/category/development-boards"
            className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize"
          >
            Development boards
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </Link>

          {/* Hover bridge keeps the cursor inside the group while moving down to the panel */}
          <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-150 z-50">
            <div
              className="w-64 origin-top-left rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-2 shadow-lg shadow-gray-900/5 ring-1 ring-black/5
                         opacity-0 -translate-y-1 scale-[0.98]
                         transition-all duration-200 ease-out
                         group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            >
              <Link
                href="/category/iot"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                IoT
              </Link>
              <Link
                href="/category/ai"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                AI
              </Link>
              <Link
                href="/category/embedded-systems-boards"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                Embedded Systems
              </Link>
              <Link
                href="/category/robotics"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                Robotics
              </Link>
            </div>
          </div>
        </li>

        {/* Lab equipments */}
        <li className="group relative">
          <Link
            href="/category/lab-equipments"
            className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize"
          >
            Lab equipments
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </Link>

          <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-150 z-50">
            <div
              className="w-72 origin-top-left rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-2 shadow-lg shadow-gray-900/5 ring-1 ring-black/5
                         opacity-0 -translate-y-1 scale-[0.98]
                         transition-all duration-200 ease-out
                         group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            >
              <Link
                href="/category/sensors-instrumentation-mr3461"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                Sensors and Instrumentation (MR3461)
              </Link>
            </div>
          </div>
        </li>

        {/* Blogs */}
        <li className="group relative">
          <Link
            href="/blogs"
            className="flex items-center gap-1 py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize"
          >
            Blogs
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </Link>

          <div className="absolute top-full left-0 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-opacity duration-150 z-50">
            <div
              className="w-48 origin-top-left rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-2 shadow-lg shadow-gray-900/5 ring-1 ring-black/5
                         opacity-0 -translate-y-1 scale-[0.98]
                         transition-all duration-200 ease-out
                         group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            >
              <Link
                href="/blogs"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600 capitalize"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                Blogs
              </Link>
              <Link
                href="/tutorials"
                className="group/item flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg transition-colors duration-150 hover:text-blue-600 capitalize"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gray-300 transition-all duration-150 group-hover/item:bg-blue-500 group-hover/item:scale-125" />
                Tutorials
              </Link>
            </div>
          </div>
        </li>

        <li>
          <Link
            href="/about"
            className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide capitalize"
          >
            About us
          </Link>
        </li>
        <li>
          <Link
            href="/faq"
            className="block py-3 px-3 text-[14px] font-semibold text-gray-700 hover:text-blue-600 transition-colors tracking-wide"
          >
            FAQ
          </Link>
        </li>
        <li>
          <Link
            href="/shop"
            className="block py-3 px-3 text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors tracking-wide capitalize"
          >
            All products
          </Link>
        </li>
      </ul>
    </div>
  );
}

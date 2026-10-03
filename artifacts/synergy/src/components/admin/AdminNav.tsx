import { Link, useLocation } from "wouter";
import { BookOpen, ClipboardList, FilePlus, FileText, Package, PackagePlus, Video } from "lucide-react";

const adminLinks = [
  { href: "/admin/add-product", label: "Add product", icon: PackagePlus },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/blogs-list", label: "Blogs List", icon: FileText },
  { href: "/admin/blogs", label: "Add Blog", icon: FilePlus },
  { href: "/admin/tutorials-list", label: "Tutorials List", icon: Video },
  { href: "/admin/tutorials", label: "Add Tutorial", icon: BookOpen },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminNav() {
  const [location] = useLocation();

  return (
    <nav className="mb-6 rounded-md border border-slate-200 bg-white p-2 shadow-sm shadow-slate-200/70">
      <div className="flex flex-wrap gap-2">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          const isActive =
            location === item.href ||
            (item.href === "/admin/blogs-list" && location.startsWith("/admin/edit-blog")) ||
            (item.href === "/admin/products" && location.startsWith("/admin/edit-product")) ||
            (item.href === "/admin/tutorials-list" && location.startsWith("/admin/edit-tutorial"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-blue-700 bg-blue-50 text-black"
                  : "border-transparent text-black hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              <Icon className="h-4 w-4 text-blue-700" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { adminLinks };

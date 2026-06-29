import { BookOpen, ClipboardList, FileText, Package } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

type AdminSectionProps = {
  title: "Blogs" | "Tutorials" | "Products" | "Orders";
};

const sectionDetails = {
  Blogs: {
    icon: FileText,
    description: "Manage blog articles, drafts, categories, and publishing status.",
  },
  Tutorials: {
    icon: BookOpen,
    description: "Manage tutorials, learning content, examples, and guide visibility.",
  },
  Products: {
    icon: Package,
    description: "Review product listings, stock status, pricing, and catalog updates.",
  },
  Orders: {
    icon: ClipboardList,
    description: "Track customer orders, payment status, fulfillment, and delivery progress.",
  },
};

export default function AdminSection({ title }: AdminSectionProps) {
  const details = sectionDetails[title];
  const Icon = details.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-black">Admin Dashboard</div>
              <h1 className="text-3xl font-bold tracking-normal text-black">{title}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-black">{details.description}</p>
        </section>
      </div>
    </div>
  );
}

import { useState, type ReactNode } from "react";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Camera,
  Pencil,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Download,
  Eye,
  Plus,
  Heart,
  Headphones,
  Receipt,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionId =
  | "profile"
  | "orders"
  | "addresses"
  | "billing"
  | "wishlist"
  | "support"
  | "settings"
  | "notifications";

interface NavItem {
  id: SectionId;
  label: string;
  icon: typeof User;
  badge?: string;
  hint?: string;
}

const navItems: NavItem[] = [
  { id: "profile", label: "Profile Details", icon: User, hint: "Personal info" },
  { id: "orders", label: "My Orders", icon: Package, badge: "12", hint: "Track & invoices" },
  { id: "addresses", label: "Addresses", icon: MapPin, hint: "Shipping & sites" },
  { id: "billing", label: "GST & Billing", icon: CreditCard, hint: "Tax & payment" },
  { id: "wishlist", label: "Saved Items", icon: Heart, hint: "Wishlist" },
  { id: "support", label: "Help & Support", icon: Headphones, hint: "Tickets & FAQs" },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "3" },
  { id: "settings", label: "Settings", icon: Settings, hint: "Security & prefs" },
];

const personalInfo = {
  name: "John Doe",
  initials: "JD",
  role: "Procurement Manager",
  company: "Acme Contractors Pvt. Ltd.",
  email: "john.doe@acmecontractors.com",
  phone: "+91 98765 43210",
  gstin: "33ABCDE1234F1Z5",
  memberSince: "January 2022",
  accountType: "B2B Business",
  verified: true,
};

const stats = [
  { value: "12", label: "Total Orders", icon: Package, accent: "text-blue-600" },
  { value: "₹2.4L", label: "Lifetime Value", icon: Receipt, accent: "text-emerald-600" },
  { value: "8", label: "Saved Items", icon: Heart, accent: "text-rose-600" },
  { value: "4.8★", label: "Buyer Rating", icon: Sparkles, accent: "text-amber-600" },
];

const orders = [
  {
    id: "SYN-12345",
    date: "Oct 24, 2024",
    items: "STM32 Dev Board × 4, Sensors Kit × 2",
    amount: "₹12,450",
    status: "In Transit",
    statusTone: "blue",
    icon: Truck,
  },
  {
    id: "SYN-12100",
    date: "Sep 15, 2024",
    items: "IoT Gateway Pro, 50× Node Modules",
    amount: "₹45,800",
    status: "Delivered",
    statusTone: "emerald",
    icon: CheckCircle2,
  },
  {
    id: "SYN-11890",
    date: "Aug 02, 2024",
    items: "Workshop Kit – Robotics Batch 2024",
    amount: "₹8,200",
    status: "Processing",
    statusTone: "amber",
    icon: Clock,
  },
];

const addresses = [
  {
    type: "Default · Office",
    name: "John Doe",
    line1: "No 24, S.V.L. Nagar, Sulur",
    line2: "Coimbatore, Tamil Nadu - 641402",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    type: "Warehouse",
    name: "Acme Contractors — Site B",
    line1: "Plot 17, SIDCO Industrial Estate",
    line2: "Coimbatore, Tamil Nadu - 641021",
    phone: "+91 98765 43211",
    isDefault: false,
  },
];

const wishlist = [
  {
    name: "Edge AI Vision Module",
    sku: "SKU-AI-V2",
    price: "₹4,299",
    note: "Notify on stock",
  },
  {
    name: "LoRaWAN Gateway Pro",
    sku: "SKU-LRW-PRO",
    price: "₹12,800",
    note: "Notify on stock",
  },
  {
    name: "Robotics Workshop Kit",
    sku: "SKU-RWK-12",
    price: "₹6,450",
    note: "Notify on stock",
  },
];

function statusToneClass(tone: string) {
  switch (tone) {
    case "blue":
      return "bg-blue-50 text-blue-700 ring-blue-200/60";
    case "emerald":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200/60";
    case "amber":
      return "bg-amber-50 text-amber-700 ring-amber-200/60";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200/60";
  }
}

function SectionShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-px w-6 bg-foreground/30" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
    </section>
  );
}

function ProfileSection() {
  return (
    <>
      {/* Profile header card */}
      <SectionShell
        eyebrow="Account"
        title="Profile Details"
        description="Manage your personal information and how it appears on Synergy Tech Labs."
        action={
          <Button
            variant="outline"
            className="h-9 rounded-full px-4 text-sm border-border/80"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-semibold text-white shadow-sm">
              {personalInfo.initials}
            </div>
            <button
              type="button"
              aria-label="Change avatar"
              className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {personalInfo.name}
              </h3>
              {personalInfo.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-blue-200/60">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/60">
                <Crown className="h-3 w-3" />
                {personalInfo.accountType}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {personalInfo.role} · Member since {personalInfo.memberSince}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {personalInfo.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {personalInfo.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {personalInfo.company}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {personalInfo.name}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {personalInfo.email}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Phone Number
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {personalInfo.phone}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Company / GSTIN
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {personalInfo.company}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              GSTIN: {personalInfo.gstin}
            </p>
          </div>
        </div>
      </SectionShell>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border/70 bg-card px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg bg-muted",
                    s.accent
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Security */}
      <SectionShell
        eyebrow="Security"
        title="Account Security"
        description="Keep your account safe with these quick actions."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Two-factor Auth",
              desc: "Enabled",
              tone: "text-emerald-600",
            },
            {
              icon: Mail,
              title: "Email Verified",
              desc: "Verified",
              tone: "text-emerald-600",
            },
            {
              icon: Phone,
              title: "Phone Verified",
              desc: "Verified",
              tone: "text-emerald-600",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3.5"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted",
                    item.tone
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionShell>
    </>
  );
}

function OrdersSection() {
  return (
    <SectionShell
      eyebrow="Activity"
      title="Recent Orders"
      description="Track shipments, download invoices, and reorder essentials."
      action={
        <Button variant="ghost" className="h-9 rounded-full text-sm">
          View all orders
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="hidden grid-cols-12 gap-3 border-b border-border/60 bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
          <div className="col-span-3">Order ID</div>
          <div className="col-span-4">Items</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <ul className="divide-y divide-border/60">
          {orders.map((order) => {
            const Icon = order.icon;
            return (
              <li
                key={order.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-12 sm:items-center sm:gap-3 sm:px-4"
              >
                <div className="sm:col-span-3">
                  <p className="text-sm font-semibold text-foreground">
                    {order.id}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className="sm:col-span-4">
                  <p className="text-sm text-foreground">{order.items}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-foreground">
                    {order.amount}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
                      statusToneClass(order.statusTone)
                    )}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2} />
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 sm:col-span-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="View order"
                    className="h-8 w-8 rounded-full"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Download invoice"
                    className="h-8 w-8 rounded-full"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}

function AddressesSection() {
  return (
    <SectionShell
      eyebrow="Locations"
      title="Saved Addresses"
      description="Manage shipping addresses for office and project sites."
      action={
        <Button className="h-9 rounded-full bg-blue-600 px-4 text-sm text-white border-blue-700 hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" />
          Add Address
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <div
            key={addr.line1}
            className="rounded-xl border border-border/60 bg-background p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {addr.type}
              </span>
              {addr.isDefault && (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700"
                >
                  Default
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {addr.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {addr.line1}
              <br />
              {addr.line2}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{addr.phone}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-xs"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-xs text-muted-foreground"
              >
                Set as default
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function BillingSection() {
  return (
    <SectionShell
      eyebrow="Tax & Billing"
      title="GST & Payment"
      description="Tax identities, payment methods, and billing preferences."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-200/60">
              <FileText className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-foreground">
              GST Certificate
            </p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            GSTIN: <span className="font-medium text-foreground">{personalInfo.gstin}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Registered under {personalInfo.company}
          </p>
          <Button variant="outline" className="mt-3 h-8 rounded-full px-3 text-xs">
            <Download className="h-3 w-3" />
            Download
          </Button>
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60">
              <CreditCard className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-foreground">
              Default Payment
            </p>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            HDFC Corporate · •••• 4521
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Net Banking · 30 day credit
          </p>
          <Button variant="outline" className="mt-3 h-8 rounded-full px-3 text-xs">
            <Pencil className="h-3 w-3" />
            Manage
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function WishlistSection() {
  return (
    <SectionShell
      eyebrow="Saved"
      title="Saved Items"
      description="Products you have bookmarked for later."
      action={
        <Button variant="ghost" className="h-9 rounded-full text-sm">
          View wishlist
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {wishlist.map((w) => (
          <div
            key={w.sku}
            className="rounded-xl border border-border/60 bg-background p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {w.sku}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {w.name}
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {w.price}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{w.note}</p>
            <Button className="mt-3 h-8 w-full rounded-full bg-blue-600 px-3 text-xs text-white border-blue-700 hover:bg-blue-700">
              Add to cart
            </Button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function SupportSection() {
  return (
    <SectionShell
      eyebrow="Help"
      title="Help & Support"
      description="Open tickets, browse FAQs, and contact our support team."
      action={
        <Button className="h-9 rounded-full bg-blue-600 px-4 text-sm text-white border-blue-700 hover:bg-blue-700">
          New Ticket
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Open Tickets", value: "2" },
          { label: "Resolved", value: "14" },
          { label: "Avg. Response", value: "4 hrs" },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-border/60 bg-background px-4 py-3.5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function NotificationsSection() {
  const items = [
    {
      title: "Order SYN-12345 has shipped",
      meta: "Order updates · 2h ago",
      tone: "blue",
    },
    {
      title: "Invoice ready for SYN-12100",
      meta: "Billing · Yesterday",
      tone: "emerald",
    },
    {
      title: "New tutorial: Getting started with Edge AI",
      meta: "Content · 3 days ago",
      tone: "amber",
    },
  ];
  return (
    <SectionShell
      eyebrow="Inbox"
      title="Notifications"
      description="Recent alerts and updates from your account."
      action={
        <Button variant="ghost" className="h-9 rounded-full text-sm">
          Mark all read
        </Button>
      }
    >
      <ul className="divide-y divide-border/60 rounded-xl border border-border/60 bg-background">
        {items.map((n) => (
          <li
            key={n.title}
            className="flex items-center gap-3 px-4 py-3.5"
          >
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                n.tone === "blue" && "bg-blue-500",
                n.tone === "emerald" && "bg-emerald-500",
                n.tone === "amber" && "bg-amber-500"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.meta}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function SettingsSection() {
  return (
    <SectionShell
      eyebrow="Preferences"
      title="Settings"
      description="Update your password, language, and notification preferences."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Display Name
          </label>
          <Input
            defaultValue={personalInfo.name}
            className="h-11 rounded-xl border-border/80 bg-background"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <Input
            defaultValue={personalInfo.email}
            className="h-11 rounded-xl border-border/80 bg-background"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Language
          </label>
          <select className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option>English (India)</option>
            <option>हिन्दी</option>
            <option>தமிழ்</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timezone
          </label>
          <select className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option>IST — Asia/Kolkata</option>
            <option>UTC</option>
            <option>Asia/Singapore</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4">
        <Button variant="outline" className="h-10 rounded-full px-5">
          Cancel
        </Button>
        <Button className="h-10 rounded-full bg-blue-600 px-5 text-white border-blue-700 hover:bg-blue-700">
          Save changes
        </Button>
      </div>
    </SectionShell>
  );
}

export default function Account() {
  const [active, setActive] = useState<SectionId>("profile");

  const activeItem = navItems.find((n) => n.id === active) ?? navItems[0];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero strip — kept subtle to match site */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(50% 50% at 0% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(50% 50% at 100% 100%, hsl(var(--primary) / 0.08), transparent 60%)",
          }}
        />
        <div className="container relative mx-auto px-4 py-10 md:py-12">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-px w-6 bg-foreground/30" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              My Account
            </span>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back,{" "}
            <span className="text-blue-600">{personalInfo.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Manage your profile, orders, addresses, and billing — all in one
            place.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar — details & sub-sections */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-6 space-y-4">
              {/* Identity card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-blue-600 to-blue-700"
                />
                <div className="relative px-5 pb-5 pt-12">
                  <div className="absolute -top-9 left-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-blue-600 to-blue-700 text-xl font-semibold text-white shadow-sm">
                    {personalInfo.initials}
                  </div>
                  <div className="ml-[76px] sm:ml-[80px]">
                    <p className="text-sm font-semibold text-foreground">
                      {personalInfo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {personalInfo.role}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-blue-200/60">
                      <Crown className="h-3 w-3" />
                      {personalInfo.accountType}
                    </span>
                    {personalInfo.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200/60">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="border-b border-border/60 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Sections
                  </p>
                </div>
                <ul className="py-1.5 text-sm">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActive(item.id)}
                          className={cn(
                            "group flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-blue-50/70 text-blue-700"
                              : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors",
                              isActive
                                ? "bg-blue-600 text-white ring-blue-700"
                                : "bg-muted text-muted-foreground ring-border/60 group-hover:text-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {item.label}
                            </span>
                            {item.hint && (
                              <span className="block truncate text-[11px] text-muted-foreground">
                                {item.hint}
                              </span>
                            )}
                          </span>
                          {item.badge ? (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 transition-colors",
                                isActive
                                  ? "text-blue-600"
                                  : "text-muted-foreground"
                              )}
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                  <li className="mt-1 border-t border-border/60 px-2 pt-1.5">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50/60"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200/60">
                        <LogOut className="h-4 w-4" />
                      </span>
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1 space-y-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>My Account</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">
                {activeItem.label}
              </span>
            </div>

            {active === "profile" && <ProfileSection />}
            {active === "orders" && <OrdersSection />}
            {active === "addresses" && <AddressesSection />}
            {active === "billing" && <BillingSection />}
            {active === "wishlist" && <WishlistSection />}
            {active === "support" && <SupportSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "settings" && <SettingsSection />}
          </main>
        </div>
      </div>
    </div>
  );
}

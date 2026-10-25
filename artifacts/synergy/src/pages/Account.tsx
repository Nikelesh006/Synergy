import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
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
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingBag,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { fetchApi } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import { products as catalogProducts } from "@/data/products";
import { useToast, toast } from "@/hooks/use-toast";
import { Product } from "@/types";

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

interface ProfileData {
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  avatar?: string;
  phone?: string;
  role?: string;
  company?: string;
  gstin?: string;
  accountType?: string;
  totalOrdersValue: number;
  savedItemsCount: number;
  buyerRating: number;
  totalOrdersCount: number;
  memberSince: Date;
  emailVerified?: boolean;
  language?: string;
  timezone?: string;
}

const navItems: NavItem[] = [
  { id: "profile", label: "Profile Details", icon: User, hint: "Personal info" },
  { id: "orders", label: "My Orders", icon: Package, hint: "Track & invoices" },
  { id: "addresses", label: "Addresses", icon: MapPin, hint: "Shipping & sites" },
  { id: "billing", label: "GST & Billing", icon: CreditCard, hint: "Tax & payment" },
  { id: "wishlist", label: "Saved Items", icon: Heart, hint: "Wishlist" },
  { id: "support", label: "Help & Support", icon: Headphones, hint: "Tickets & FAQs" },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "3" },
  { id: "settings", label: "Settings", icon: Settings, hint: "Security & prefs" },
];


export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface DetailedOrder {
  id: string;
  trackingId?: string;
  date: string;
  time?: string;
  status: "In Transit" | "Delivered" | "Processing" | "Confirmed" | "Cancelled";
  statusTone: "blue" | "emerald" | "amber" | "indigo" | "rose";
  estimatedDelivery?: string;
  deliveredDate?: string;
  courierName: string;
  trackingNumber: string;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  razorpayPaymentId?: string;
  subtotal: number;
  gst: number;
  shippingCharge: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingSteps: {
    title: string;
    description: string;
    timestamp?: string;
    completed: boolean;
    current?: boolean;
  }[];
  items: OrderItem[];
}

function getInitialRichOrders(): DetailedOrder[] {
  return [];
}

interface Address {
  _id?: string;
  type: string;
  name: string;
  line1: string;
  line2: string;
  phone: string;
  isDefault: boolean;
}

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

function ProfileSection({ profile, onEdit }: { profile: ProfileData; onEdit: () => void }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const stats = [
    { value: profile.totalOrdersCount.toString(), label: "Total Orders", icon: Package, accent: "text-blue-600" },
    { value: formatCurrency(profile.totalOrdersValue), label: "Lifetime Value", icon: Receipt, accent: "text-emerald-600" },
    { value: profile.savedItemsCount.toString(), label: "Saved Items", icon: Heart, accent: "text-rose-600" },
    { value: `${profile.buyerRating.toFixed(1)}★`, label: "Buyer Rating", icon: Sparkles, accent: "text-amber-600" },
  ];

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
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        }
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-semibold text-white shadow-sm">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                getInitials(profile.name)
              )}
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
                {profile.name}
              </h3>
              {profile.emailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-blue-200/60">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200/60">
                <Crown className="h-3 w-3" />
                {profile.accountType || "B2B Business"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.role || "Customer"} · Member since {formatDate(profile.memberSince)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {profile.phone}
                </span>
              )}
              {profile.company && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {profile.company}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profile.name}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profile.email}
            </p>
          </div>
          {profile.phone && (
            <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {profile.phone}
              </p>
            </div>
          )}
          {profile.company && (
            <div className="rounded-xl border border-border/60 bg-background px-4 py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Company / GSTIN
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {profile.company}
              </p>
              {profile.gstin && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  GSTIN: {profile.gstin}
                </p>
              )}
            </div>
          )}
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
              desc: profile.emailVerified ? "Verified" : "Not Verified",
              tone: profile.emailVerified ? "text-emerald-600" : "text-amber-600",
            },
            {
              icon: Phone,
              title: "Phone Verified",
              desc: profile.phone ? "Verified" : "Not Added",
              tone: profile.phone ? "text-emerald-600" : "text-amber-600",
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

function printInvoice(order: DetailedOrder) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const itemsHtml = order.items
    .map(
      (it, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong>${it.product.name}</strong><br/>
        <span style="font-size: 11px; color: #6b7280;">SKU: ${it.product.sku || "N/A"} | Brand: ${it.product.brand || "Synergy"}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${it.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${it.unitPrice.toLocaleString("en-IN")}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">18%</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(it.unitPrice * it.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tax Invoice - ${order.id}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; padding: 40px; margin: 0; background: #fff; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; }
        .badge { display: inline-block; padding: 4px 10px; background: #eff6ff; color: #1d4ed8; font-weight: 700; border-radius: 6px; font-size: 11px; }
        .grid { display: flex; justify-content: space-between; margin-bottom: 24px; gap: 20px; }
        .col { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; color: #4b5563; }
        .summary { width: 320px; margin-left: auto; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; font-weight: 800; color: #111827; border-top: 2px solid #111827; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">SYNERGY TECH LABS</div>
          <p style="margin: 4px 0 0 0; color: #4b5563; font-size: 12px;">Next-Gen Hardware & Electrical Solutions</p>
          <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 11px;">GSTIN: 33AAECS9821F1Z8 | PAN: AAECS9821F</p>
        </div>
        <div style="text-align: right;">
          <div class="badge">ORIGINAL TAX INVOICE</div>
          <h2 style="margin: 8px 0 2px 0; font-size: 18px;">Invoice #${order.id}</h2>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Date: ${order.date}</p>
        </div>
      </div>

      <div class="grid">
        <div class="col">
          <p style="font-weight: 700; text-transform: uppercase; font-size: 11px; color: #6b7280; margin-bottom: 6px;">Billed & Shipped To:</p>
          <p style="font-weight: 600; margin: 0 0 4px 0;">${order.shippingAddress.name}</p>
          <p style="color: #4b5563; margin: 0; line-height: 1.5;">
            ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ", " + order.shippingAddress.line2 : ""}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>
        <div class="col" style="text-align: right;">
          <p style="font-weight: 700; text-transform: uppercase; font-size: 11px; color: #6b7280; margin-bottom: 6px;">Order & Shipping Info:</p>
          <p style="margin: 0 0 4px 0;"><strong>Tracking ID:</strong> ${order.trackingNumber}</p>
          <p style="margin: 0 0 4px 0; color: #4b5563;"><strong>Courier:</strong> ${order.courierName}</p>
          <p style="margin: 0 0 4px 0; color: #4b5563;"><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Description</th>
            <th style="text-align: center; width: 60px;">Qty</th>
            <th style="text-align: right; width: 100px;">Rate</th>
            <th style="text-align: right; width: 60px;">GST</th>
            <th style="text-align: right; width: 110px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span style="color: #4b5563;">Subtotal</span>
          <span>₹${order.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div class="summary-row">
          <span style="color: #4b5563;">Shipping & Handling</span>
          <span>${order.shippingCharge === 0 ? "FREE" : "₹" + order.shippingCharge}</span>
        </div>
        <div class="summary-row">
          <span style="color: #4b5563;">CGST (9%)</span>
          <span>₹${Math.round(order.gst / 2).toLocaleString("en-IN")}</span>
        </div>
        <div class="summary-row">
          <span style="color: #4b5563;">SGST (9%)</span>
          <span>₹${Math.round(order.gst / 2).toLocaleString("en-IN")}</span>
        </div>
        <div class="total-row">
          <span>Total (INR)</span>
          <span>₹${order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div class="footer">
        <p>This is a computer-generated tax invoice and requires no physical signature. Thank you for partnering with Synergy Tech Labs!</p>
        <p>Support: support@synergytechlabs.com | Toll-Free: 1800-419-8989</p>
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function OrdersSection() {
  const { user, addToCart } = useStore();
  const { toast } = useToast();
  const [ordersList, setOrdersList] = useState<DetailedOrder[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [selectedItemIndices, setSelectedItemIndices] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination & "View All" states
  const [isViewAll, setIsViewAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const ordersTopRef = useRef<HTMLDivElement>(null);

  // Reset page to 1 whenever search query or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Attempt to fetch any orders created by the user from API and merge, as well as local orders
  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      const ordersMap = new Map<string, DetailedOrder>();

      // 1. Fetch from API if user is authenticated or has email
      if (user?.userId || user?.email) {
        try {
          const params = new URLSearchParams();
          if (user.userId) params.append("userId", user.userId);
          if (user.email) params.append("email", user.email);

          const response = await fetchApi<{ success: boolean; orders: any[] }>(`/orders?${params.toString()}`);
          if (response?.success && Array.isArray(response.orders)) {
            response.orders.forEach((o: any) => {
              const mappedItems: OrderItem[] = (o.items || []).map((it: any) => {
                const matchedCatalog = catalogProducts.find(
                  (cp) =>
                    (it.slug && cp.slug === it.slug) ||
                    String(cp.id) === String(it.productId) ||
                    String((cp as any)._id) === String(it.productId) ||
                    (it.sku && it.sku !== "SYN-SKU" && cp.sku?.toLowerCase() === it.sku.toLowerCase()) ||
                    (it.name && cp.name?.toLowerCase() === (it.name || "").toLowerCase())
                );
                const fallbackProduct: Product = {
                  id: it.productId || `prod_${Date.now()}`,
                  name: it.name || "Hardware Component",
                  slug: it.slug || (it.name ? it.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "component"),
                  sku: it.sku || "SYN-HW",
                  brand: it.brand || "Synergy",
                  category: it.category || "Components",
                  subcategory: it.subcategory || "General",
                  shortDescription: it.name || "Hardware component",
                  description: it.description || "",
                  specifications: {},
                  features: ["Authentic Component", "GST Billed"],
                  applications: ["Prototyping", "Industrial"],
                  images: it.image ? [it.image] : ["/categories/embedded-boards.jpg"],
                  price: it.price || 999,
                  currency: "INR",
                  stock: 50,
                  inStock: true,
                  minOrderQty: 1,
                  rating: 4.8,
                  reviewCount: 30,
                  isFeatured: true,
                  isNewArrival: false,
                  isBestSeller: true,
                  warrantyInfo: "1 Year",
                  shippingInfo: "Ships within 24 hours",
                };
                return {
                  product: matchedCatalog || fallbackProduct,
                  quantity: it.quantity || 1,
                  unitPrice: it.price || 999,
                };
              });

              const statusNormalized = (o.status || "confirmed").toLowerCase();
              let status: DetailedOrder["status"] = "Processing";
              let statusTone: DetailedOrder["statusTone"] = "amber";

              if (statusNormalized === "delivered") {
                status = "Delivered";
                statusTone = "emerald";
              } else if (statusNormalized === "shipped" || statusNormalized === "in transit") {
                status = "In Transit";
                statusTone = "blue";
              } else if (statusNormalized === "cancelled") {
                status = "Cancelled";
                statusTone = "rose";
              }

              const orderId = o.trackingId || `SYN-${String(o._id || o.id || "").slice(-5).toUpperCase() || "ORD"}`;

              ordersMap.set(orderId, {
                id: orderId,
                trackingId: o.trackingId || orderId,
                date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                time: new Date(o.createdAt || Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                status,
                statusTone,
                estimatedDelivery: "3-5 business days",
                courierName: "Delhivery Logistics Air",
                trackingNumber: o.trackingId || `DLHV-${Date.now().toString().slice(-6)}`,
                paymentMethod: o.paymentMethod ? o.paymentMethod.toUpperCase() : "UPI",
                paymentStatus: o.paymentStatus === "paid" ? "Paid" : "Pending",
                subtotal: o.subtotal || o.total || 0,
                gst: o.gst || Math.round((o.total || 0) * 0.18),
                shippingCharge: o.shippingCharge || 0,
                total: o.total || 0,
                shippingAddress: {
                  name: o.shippingAddress?.fullName || o.customer?.name || user?.name || "Customer",
                  phone: o.shippingAddress?.phone || o.customer?.phone || "+91 9876543210",
                  line1: o.shippingAddress?.addressLine1 || "Corporate Hub",
                  line2: o.shippingAddress?.addressLine2 || "",
                  city: o.shippingAddress?.city || "Bengaluru",
                  state: o.shippingAddress?.state || "Karnataka",
                  pincode: o.shippingAddress?.pincode || "560100",
                },
                trackingSteps: [
                  {
                    title: "Order Placed",
                    description: "Order placed successfully.",
                    timestamp: new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    completed: true,
                  },
                  {
                    title: "Order Confirmed & Processing",
                    description: "Order verified by fulfillment team.",
                    completed: true,
                    current: status === "Processing",
                  },
                  {
                    title: "In Transit",
                    description: "Dispatched with Delhivery courier.",
                    completed: status === "In Transit" || status === "Delivered",
                    current: status === "In Transit",
                  },
                  {
                    title: "Delivered",
                    description: "Delivered to shipping destination.",
                    completed: status === "Delivered",
                    current: status === "Delivered",
                  },
                ],
                items: mappedItems,
              });
            });
          }
        } catch (e) {
          console.warn("Failed to fetch API orders:", e);
        }
      }

      // 2. Check local orders placed in browser session (strictly scoped to current user)
      try {
        const orderKey = user?.userId ? `synergy_local_orders_${user.userId}` : null;
        const localSaved = orderKey ? localStorage.getItem(orderKey) : null;
        if (localSaved) {
          const localList = JSON.parse(localSaved);
          if (Array.isArray(localList)) {
            localList.forEach((lo: any) => {
              const localId = lo.trackingId || lo.id;
              if (localId && !ordersMap.has(localId)) {
                const localItems: OrderItem[] = Array.isArray(lo.items) && lo.items.length > 0
                  ? lo.items.map((it: any) => {
                      const matchedCatalog = catalogProducts.find(
                        (cp) =>
                          (it.slug && cp.slug === it.slug) ||
                          (it.product?.slug && cp.slug === it.product.slug) ||
                          String(cp.id) === String(it.productId || it.product?.id) ||
                          String((cp as any)._id) === String(it.productId || it.product?._id) ||
                          (it.sku && it.sku !== "SYN-SKU" && cp.sku?.toLowerCase() === it.sku.toLowerCase()) ||
                          (it.name && cp.name?.toLowerCase() === (it.name || "").toLowerCase())
                      );
                      const prod = matchedCatalog || it.product || {
                        id: it.productId || "p-local",
                        name: it.name || "Hardware Component",
                        slug: it.slug || (it.name ? it.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "component"),
                        sku: it.sku || "SYN-HW",
                        brand: "Synergy",
                        category: "Components",
                        subcategory: "Hardware",
                        shortDescription: it.name || "Component",
                        description: "",
                        specifications: {},
                        features: [],
                        applications: [],
                        images: it.image ? [it.image] : ["/categories/embedded-boards.jpg"],
                        price: it.price || 999,
                        currency: "INR",
                        stock: 10,
                        inStock: true,
                        minOrderQty: 1,
                        rating: 5,
                        reviewCount: 1,
                        isFeatured: false,
                        isNewArrival: false,
                        isBestSeller: false,
                        warrantyInfo: "1 Year",
                        shippingInfo: "Standard",
                      };
                      return {
                        product: prod,
                        quantity: it.quantity || 1,
                        unitPrice: it.unitPrice || it.price || prod.price || 999,
                      };
                    })
                  : [];

                ordersMap.set(localId, {
                  id: localId,
                  trackingId: lo.trackingId || localId,
                  date: new Date(lo.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  time: new Date(lo.createdAt || Date.now()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                  status: "Processing",
                  statusTone: "amber",
                  estimatedDelivery: "3-5 business days",
                  courierName: "Delhivery Logistics Air",
                  trackingNumber: lo.trackingId || `DLHV-${Date.now().toString().slice(-6)}`,
                  paymentMethod: lo.paymentMethod ? lo.paymentMethod.toUpperCase() : "UPI",
                  paymentStatus: "Paid",
                  subtotal: lo.subtotal || lo.total || 0,
                  gst: lo.gst || Math.round((lo.total || 0) * 0.18),
                  shippingCharge: lo.shippingCharge || 0,
                  total: lo.total || 0,
                  shippingAddress: {
                    name: lo.shippingAddress?.fullName || user?.name || "Customer",
                    phone: lo.shippingAddress?.phone || "+91 9876543210",
                    line1: lo.shippingAddress?.addressLine1 || "Corporate Hub",
                    line2: lo.shippingAddress?.addressLine2 || "",
                    city: lo.shippingAddress?.city || "Bengaluru",
                    state: lo.shippingAddress?.state || "Karnataka",
                    pincode: lo.shippingAddress?.pincode || "560100",
                  },
                  trackingSteps: [
                    {
                      title: "Order Placed & Verified",
                      description: "Order placed successfully.",
                      timestamp: new Date(lo.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                      completed: true,
                    },
                    {
                      title: "Order Confirmed & Processing",
                      description: "Allocated hardware and verifying serial codes.",
                      completed: true,
                      current: true,
                    },
                    {
                      title: "In Transit",
                      description: "Express dispatch with Delhivery courier.",
                      completed: false,
                    },
                    {
                      title: "Delivered",
                      description: "Delivered to destination.",
                      completed: false,
                    },
                  ],
                  items: localItems,
                });
              }
            });
          }
        }
      } catch (e) {
        // ignore
      }

      if (isMounted) {
        setOrdersList(Array.from(ordersMap.values()));
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({
      title: "Order ID Copied",
      description: `${id} copied to your clipboard.`,
      duration: 2000,
    });
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2500);
  };

  const handleBuyAgain = (order: DetailedOrder) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    toast({
      title: "Items Added to Cart",
      description: `All items from order ${order.id} were added to your cart.`,
      variant: "cart",
      duration: 3500,
    });
  };

  // Filter orders by search & status
  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const hasMoreThan4 = filteredOrders.length > 4;

  // In standard view: show first 4. In "View All" view: show 4 per page with pagination 1, 2, 3, 4, 5...
  const displayedOrders = isViewAll
    ? filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
    : filteredOrders.slice(0, 4);

  const scrollToOrdersTop = () => {
    if (ordersTopRef.current) {
      const topOffset = ordersTopRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    scrollToOrdersTop();
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const statusCounts = {
    all: ordersList.length,
    "in transit": ordersList.filter((o) => o.status === "In Transit").length,
    delivered: ordersList.filter((o) => o.status === "Delivered").length,
    processing: ordersList.filter((o) => o.status === "Processing").length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Filter Bar */}
      <SectionShell
        eyebrow="Activity"
        title="My Orders"
        description="Track current deliveries, review live order status, download GST invoices, and reorder hardware."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200/60">
              <Package className="h-3.5 w-3.5" />
              {ordersList.length} Total Orders
            </span>
            {hasMoreThan4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!isViewAll) {
                    setIsViewAll(true);
                    setCurrentPage(1);
                  } else {
                    setIsViewAll(false);
                    setCurrentPage(1);
                  }
                  scrollToOrdersTop();
                }}
                className="h-8 rounded-full text-xs font-semibold px-3 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all shadow-sm"
              >
                {isViewAll ? "Show Recent 4" : `View All (${filteredOrders.length})`}
              </Button>
            )}
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by Order ID, Product name, or Tracking code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-9 rounded-xl border-border/80 bg-background text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Orders", count: statusCounts.all },
              { id: "in transit", label: "In Transit", count: statusCounts["in transit"] },
              { id: "delivered", label: "Delivered", count: statusCounts.delivered },
              { id: "processing", label: "Processing", count: statusCounts.processing },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                    active
                      ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                      active ? "bg-white/20 text-white" : "bg-background/80 text-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* Orders List Container */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No orders found</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}". Try searching by another product name or reset your search filter.`
              : "No orders match the selected status filter."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            )}
            <Link href="/shop">
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-4">
                Browse Shop Catalog
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div ref={ordersTopRef} className="space-y-6">
          {displayedOrders.map((order) => {
            const isExpanded = Boolean(expandedOrders[order.id]);
            const selectedItemIndex = selectedItemIndices[order.id] || 0;
            const currentOrderItem = order.items[selectedItemIndex] || order.items[0];

            return (
              <div
                key={order.id}
                className="group relative rounded-2xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* 1. Order Top Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-6 sm:py-3.5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-foreground">
                        #{order.id}
                      </span>
                      <button
                        type="button"
                        aria-label="Copy Order ID"
                        onClick={() => handleCopyOrderId(order.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId === order.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Placed: {order.date}</span>
                      {order.time && <span>· {order.time}</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        statusToneClass(order.statusTone)
                      )}
                    >
                      {order.status === "Delivered" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                      ) : order.status === "In Transit" ? (
                        <Truck className="h-3.5 w-3.5" strokeWidth={2.5} />
                      ) : (
                        <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                      )}
                      {order.status}
                    </span>

                    <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground">
                      {order.status === "Delivered" ? (
                        <span className="text-emerald-700 font-semibold">{order.deliveredDate || "Delivered"}</span>
                      ) : (
                        <span>Est: {order.estimatedDelivery}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* 2. Main Order Layout: Product Card on Left, Details & Tracking on Right */}
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row items-stretch gap-6">
                    {/* LEFT: Same Home Page Product Card */}
                    <div className="w-full md:w-[280px] lg:w-[310px] shrink-0 flex flex-col">
                      <div className="relative rounded-2xl border border-border/60 bg-background/50 p-2 sm:p-2.5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between px-1 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-blue-600" />
                            Product Preview {order.items.length > 1 ? `(${selectedItemIndex + 1}/${order.items.length})` : ""}
                          </span>
                          {currentOrderItem.quantity > 1 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Ordered Qty: {currentOrderItem.quantity}
                            </Badge>
                          )}
                        </div>

                        {/* Exact ProductCard as on Home Page */}
                        <div className="rounded-xl overflow-hidden shadow-sm flex-1">
                          <ProductCard product={currentOrderItem.product} />
                        </div>

                        {/* Multi-item switcher if order has multiple products */}
                        {order.items.length > 1 && (
                          <div className="mt-3 pt-2.5 border-t border-border/60">
                            <div className="flex items-center justify-between mb-1.5 px-0.5">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                Order Items ({order.items.length}):
                              </span>
                              <span className="text-[10px] text-blue-600 font-medium">Click to inspect</span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                              {order.items.map((item, idx) => (
                                <button
                                  key={item.product.id || idx}
                                  type="button"
                                  onClick={() =>
                                    setSelectedItemIndices((prev) => ({
                                      ...prev,
                                      [order.id]: idx,
                                    }))
                                  }
                                  className={cn(
                                    "relative h-12 w-12 rounded-xl border p-1 transition-all shrink-0 bg-background flex items-center justify-center",
                                    selectedItemIndex === idx
                                      ? "border-blue-600 ring-2 ring-blue-600/20 shadow-sm scale-105"
                                      : "border-border/60 hover:border-border opacity-70 hover:opacity-100"
                                  )}
                                  title={`${item.product.name} (Qty: ${item.quantity})`}
                                >
                                  <img
                                    src={item.product.images?.[0] || "/categories/embedded-boards.jpg"}
                                    alt={item.product.name}
                                    className="h-full w-full object-contain rounded-lg"
                                  />
                                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white shadow">
                                    {item.quantity}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Price, Status, Tracking & Actions */}
                    <div className="flex-1 flex flex-col justify-between gap-5 min-w-0">
                      {/* Top: Price and Payment details */}
                      <div>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Order Total
                            </p>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                ₹{order.total.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                ({order.items.reduce((acc, i) => acc + i.quantity, 0)} items total)
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs py-1 px-2.5 bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                              {order.paymentStatus} · {order.paymentMethod.split(" ")[0]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs py-1 px-2.5 bg-slate-50 text-slate-700 border-slate-200 font-medium"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-blue-600" />
                              GST ITC Claimable
                            </Badge>
                          </div>
                        </div>

                        {/* Items list overview summary */}
                        <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">Items in shipment: </span>
                          {order.items
                            .map((it) => `${it.product.name} (×${it.quantity})`)
                            .join(", ")}
                        </div>
                      </div>

                      {/* Middle: Shipment Tracking Quick Glance */}
                      <div className="rounded-xl border border-border/60 bg-background/60 p-3.5 sm:p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl ring-1 shrink-0",
                                order.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                                  : order.status === "In Transit"
                                  ? "bg-blue-50 text-blue-600 ring-blue-200"
                                  : "bg-amber-50 text-amber-600 ring-amber-200"
                              )}
                            >
                              {order.status === "Delivered" ? (
                                <CheckCircle2 className="h-4.5 w-4.5" />
                              ) : order.status === "In Transit" ? (
                                <Truck className="h-4.5 w-4.5" />
                              ) : (
                                <Clock className="h-4.5 w-4.5" />
                              )}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                {order.courierName} ·{" "}
                                <span className="font-mono text-muted-foreground">
                                  {order.trackingNumber}
                                </span>
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {order.status === "Delivered"
                                  ? order.deliveredDate || "Delivered to recipient"
                                  : `Expected delivery: ${order.estimatedDelivery}`}
                              </p>
                            </div>
                          </div>

                          <Link href={`/track-order`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-full text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Track Order
                              <ArrowUpRight className="h-3 w-3 ml-0.5" />
                            </Button>
                          </Link>
                        </div>

                        {/* Visual 4-Stage Mini Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-muted rounded-full" />
                            <div
                              className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500",
                                order.status === "Delivered"
                                  ? "bg-emerald-500 w-full"
                                  : order.status === "In Transit"
                                  ? "bg-blue-600 w-3/4"
                                  : order.status === "Processing"
                                  ? "bg-amber-500 w-1/2"
                                  : "bg-blue-500 w-1/4"
                              )}
                            />
                            {["Placed", "Packed", "In Transit", "Delivered"].map((stage, sIdx) => {
                              const isDone =
                                order.status === "Delivered" ||
                                (order.status === "In Transit" && sIdx <= 2) ||
                                (order.status === "Processing" && sIdx <= 1) ||
                                sIdx === 0;
                              return (
                                <div key={stage} className="relative z-10 flex flex-col items-center">
                                  <span
                                    className={cn(
                                      "h-3 w-3 rounded-full border-2 border-background ring-1 transition-colors",
                                      isDone
                                        ? order.status === "Delivered"
                                          ? "bg-emerald-500 ring-emerald-500"
                                          : "bg-blue-600 ring-blue-600"
                                        : "bg-muted ring-border"
                                    )}
                                  />
                                  <span className="mt-1 text-[10px] font-medium text-muted-foreground hidden sm:block">
                                    {stage}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Actions Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Accordion Toggle: When clicked, the rest of the details are opened */}
                          <Button
                            type="button"
                            variant={isExpanded ? "secondary" : "outline"}
                            size="sm"
                            className={cn(
                              "h-9 rounded-full text-xs font-semibold px-4 transition-all gap-1.5",
                              isExpanded
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "hover:bg-muted"
                            )}
                            onClick={() => toggleOrderExpanded(order.id)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {isExpanded ? "Hide Details" : "View Details"}
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 ml-0.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 ml-0.5" />
                            )}
                          </Button>

                          {/* Invoice PDF Button */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 rounded-full text-xs font-medium px-3.5 hover:bg-muted gap-1.5"
                            onClick={() => printInvoice(order)}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Invoice (PDF)
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Buy Again button */}
                          <Button
                            type="button"
                            size="sm"
                            className="h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 gap-1.5 shadow-sm"
                            onClick={() => handleBuyAgain(order)}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Buy Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Collapsible Accordion: The Rest of the Details */}
                {isExpanded && (
                  <div className="border-t border-border/70 bg-muted/20 px-4 py-5 sm:px-6 sm:py-6 space-y-6 animate-in fade-in-50 duration-300">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-blue-600" />
                        Complete Order Breakdown & Tracking Journey
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => toggleOrderExpanded(order.id)}
                      >
                        Hide Details
                        <ChevronUp className="h-3 w-3 ml-1" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left 7 Columns: Tracking Milestones Timeline + Order Items list */}
                      <div className="lg:col-span-7 space-y-5">
                        {/* Milestone Timeline */}
                        <div className="rounded-xl border border-border/60 bg-background p-4 sm:p-5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-blue-600" />
                            Shipment Tracking Journey
                          </h5>
                          <div className="space-y-4 relative pl-4 border-l-2 border-blue-500/30 ml-2">
                            {order.trackingSteps.map((step, idx) => (
                              <div key={idx} className="relative">
                                <span
                                  className={cn(
                                    "absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ring-2",
                                    step.completed
                                      ? "bg-emerald-500 ring-emerald-400"
                                      : step.current
                                      ? "bg-blue-600 ring-blue-400 animate-pulse"
                                      : "bg-muted ring-border"
                                  )}
                                />
                                <div className="flex flex-wrap items-baseline justify-between gap-1">
                                  <p
                                    className={cn(
                                      "text-xs font-semibold",
                                      step.current ? "text-blue-600 font-bold" : "text-foreground"
                                    )}
                                  >
                                    {step.title}
                                  </p>
                                  {step.timestamp && (
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                      {step.timestamp}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {step.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Detailed All Products List */}
                        <div className="rounded-xl border border-border/60 bg-background p-4 sm:p-5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                            <Package className="h-3.5 w-3.5 text-blue-600" />
                            All Items In This Order ({order.items.length})
                          </h5>
                          <div className="divide-y divide-border/60">
                            {order.items.map((item, iIdx) => (
                              <div
                                key={item.product.id || iIdx}
                                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.product.images?.[0] || "/categories/embedded-boards.jpg"}
                                    alt={item.product.name}
                                    className="h-12 w-12 rounded-lg object-contain border border-border/60 bg-muted/40 p-1 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <Link
                                      href={`/product/${encodeURIComponent(item.product.slug || item.product.id)}`}
                                      className="text-xs font-semibold text-foreground hover:text-blue-600 line-clamp-1"
                                    >
                                      {item.product.name}
                                    </Link>
                                    <p className="text-[11px] text-muted-foreground">
                                      SKU: {item.product.sku} · Qty: {item.quantity} × ₹
                                      {item.unitPrice.toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="text-xs font-bold text-foreground">
                                    ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] text-blue-600 hover:text-blue-700 px-2 mt-0.5"
                                    onClick={() => {
                                      addToCart(item.product, item.quantity);
                                      toast({
                                        title: "Added to Cart",
                                        description: `${item.product.name} added to cart.`,
                                      });
                                    }}
                                  >
                                    Buy again
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right 5 Columns: Delivery Address, Financial & Tax Breakdown, Invoice */}
                      <div className="lg:col-span-5 space-y-5">
                        {/* Shipping Destination */}
                        <div className="rounded-xl border border-border/60 bg-background p-4 sm:p-5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-blue-600" />
                            Shipping Destination
                          </h5>
                          <p className="text-xs font-bold text-foreground">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {order.shippingAddress.line1}
                            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.shippingAddress.phone}
                          </p>
                        </div>

                        {/* Tax & Financial Breakdown */}
                        <div className="rounded-xl border border-border/60 bg-background p-4 sm:p-5 space-y-2.5">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Receipt className="h-3.5 w-3.5 text-blue-600" />
                            Tax & Payment Breakdown
                          </h5>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Items Subtotal</span>
                            <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Shipping & Handling</span>
                            <span
                              className={
                                order.shippingCharge === 0 ? "text-emerald-600 font-semibold" : ""
                              }
                            >
                              {order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>GST (18% ITC Eligible)</span>
                            <span>₹{order.gst.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="border-t border-border/60 pt-2 flex justify-between items-baseline">
                            <span className="text-xs font-bold text-foreground">Total Paid</span>
                            <span className="text-base font-extrabold text-foreground">
                              ₹{order.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/40">
                            <span>Method: {order.paymentMethod}</span>
                            <span className="text-emerald-600 font-semibold">
                              Status: {order.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Invoice & Actions Card */}
                        <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                Official GST Tax Invoice
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Valid GST invoice with HSN codes & ITC input tax credit
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            className="w-full h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
                            onClick={() => printInvoice(order)}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Print / Save Tax Invoice (PDF)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* After 4 orders, if hasMoreThan4 and !isViewAll: View All Orders Button */}
          {!isViewAll && hasMoreThan4 && (
            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 p-6 sm:p-8 text-center shadow-sm">
              <div className="max-w-md mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold ring-1 ring-blue-200/60">
                  <Package className="h-3.5 w-3.5" />
                  <span>+{filteredOrders.length - 4} more orders in your history</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-foreground">
                  Looking for older hardware shipments?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  You have {filteredOrders.length} orders on file. Open your complete order history to browse all previous items with multi-page navigation.
                </p>
                <div className="pt-1">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      setIsViewAll(true);
                      setCurrentPage(1);
                      scrollToOrdersTop();
                    }}
                    className="h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>View All {filteredOrders.length} Orders</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Paginated Navigation: 1, 2, 3, 4, 5... when isViewAll is true */}
          {isViewAll && totalPages > 1 && (
            <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              {/* Left: Summary text */}
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Showing{" "}
                <span className="font-bold text-foreground">
                  {(currentPage - 1) * ordersPerPage + 1}–
                  {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
                </span>{" "}
                of <span className="font-bold text-foreground">{filteredOrders.length}</span> orders
                <span className="mx-1.5 text-muted-foreground/60">•</span>
                <span className="font-semibold text-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              {/* Center / Right: Numbered Pagination Controls: [Prev] 1, 2, 3, 4, 5... [Next] */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* Previous Page Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-9 px-2.5 rounded-xl text-xs font-semibold gap-1 disabled:opacity-40 border-border/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Numbered Page Buttons: 1, 2, 3, 4, 5... */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum, idx) => {
                    if (typeof pageNum === "string") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-9 w-7 flex items-center justify-center text-xs text-muted-foreground font-bold"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Go to page ${pageNum}`}
                        className={cn(
                          "h-9 min-w-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                          isActive
                            ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30 font-extrabold"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="h-9 px-2.5 rounded-xl text-xs font-semibold gap-1 disabled:opacity-40 border-border/80"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick switch back to 4 recent orders */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsViewAll(false);
                  setCurrentPage(1);
                  scrollToOrdersTop();
                }}
                className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Show Recent 4
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddressesSection({ 
  addresses, 
  onAdd, 
  onEdit, 
  onSetDefault, 
  onDelete 
}: { 
  addresses: Address[]; 
  onAdd: () => void; 
  onEdit: (address: Address) => void; 
  onSetDefault: (addressId: string) => void; 
  onDelete: (addressId: string) => void; 
}) {
  return (
    <SectionShell
      eyebrow="Locations"
      title="Saved Addresses"
      description="Manage shipping addresses for office and project sites."
      action={
        <Button 
          className="h-9 rounded-full bg-blue-600 px-4 text-sm text-white hover:bg-blue-700 shadow-sm"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Address
        </Button>
      }
    >
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/50 p-8 text-center sm:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3.5 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-foreground">No saved addresses yet</h4>
          <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
            Add your office, warehouse, or lab delivery address for faster 1-click checkout and automated shipping documentation.
          </p>
          <Button
            onClick={onAdd}
            className="mt-4 h-9 rounded-full bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const addressKey = addr._id || addr.line1;
            return (
              <div
                key={addressKey}
                className={cn(
                  "rounded-2xl border p-5 transition-all flex flex-col justify-between",
                  addr.isDefault
                    ? "border-blue-500/60 bg-blue-50/20 shadow-sm ring-1 ring-blue-500/20"
                    : "border-border/70 bg-card hover:border-border"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      {addr.type || "Office"}
                    </span>
                    {addr.isDefault ? (
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shadow-xs"
                      >
                        Default Address
                      </Badge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSetDefault(addressKey)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Make Default
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-sm font-bold text-foreground">
                    {addr.name}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {addr.line1}
                    {addr.line2 && (
                      <>
                        <br />
                        {addr.line2}
                      </>
                    )}
                  </p>
                  <p className="mt-2.5 text-xs font-medium text-foreground/85 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {addr.phone}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-border/60 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs font-medium"
                    onClick={() => onEdit(addr)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => onSetDefault(addressKey)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Set as default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-xs text-rose-600 hover:bg-rose-50 ml-auto"
                    onClick={() => onDelete(addressKey)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}

interface AddressModalProps {
  address?: Address;
  isFirstAddress?: boolean;
  onClose: () => void;
  onSave: (data: Omit<Address, '_id'>) => void;
}

function AddressModal({ address, isFirstAddress, onClose, onSave }: AddressModalProps) {
  const [formData, setFormData] = useState({
    type: address?.type || 'Office',
    name: address?.name || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    phone: address?.phone || '',
    isDefault: address ? Boolean(address.isDefault) : (isFirstAddress ? true : false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.line1.trim() || !formData.phone.trim()) {
      return;
    }
    onSave({
      type: formData.type,
      name: formData.name.trim(),
      line1: formData.line1.trim(),
      line2: formData.line2.trim(),
      phone: formData.phone.trim(),
      isDefault: isFirstAddress ? true : formData.isDefault,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border/80 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {address ? 'Edit Address' : 'Add New Address'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your shipping destination for delivery and GST invoices
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Address Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="Office">Office / HQ</option>
              <option value="Warehouse">Warehouse / Depot</option>
              <option value="Home">Home / Residential</option>
              <option value="Lab">R&D Lab / Facility</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact / Company Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Code Craft Labs / Rahul Sharma"
              className="h-11 rounded-xl border-border/80 bg-background text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              placeholder="Building, street, plot number, or tech park"
              className="h-11 rounded-xl border-border/80 bg-background text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Address Line 2 <span className="text-muted-foreground font-normal lowercase">(city, state, pin code)</span>
            </label>
            <Input
              value={formData.line2}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
              placeholder="e.g. Electronic City Phase 1, Bengaluru, Karnataka - 560100"
              className="h-11 rounded-xl border-border/80 bg-background text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="h-11 rounded-xl border-border/80 bg-background text-sm"
              required
            />
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault || isFirstAddress}
              disabled={isFirstAddress}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-border/80 text-blue-600 focus:ring-blue-600 cursor-pointer disabled:opacity-75"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-foreground cursor-pointer select-none">
              Set as default shipping address
              {isFirstAddress && (
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">(first address is automatically default)</span>
              )}
            </label>
          </div>
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 rounded-full px-5 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
            >
              {address ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BillingSection({ profile }: { profile: ProfileData }) {
  return (
    <SectionShell
      eyebrow="Tax & Billing"
      title="GST & Payment"
      description="Tax identities, payment methods, and billing preferences."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {profile.gstin && (
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
              GSTIN: <span className="font-medium text-foreground">{profile.gstin}</span>
            </p>
            {profile.company && (
              <p className="mt-1 text-xs text-muted-foreground">
                Registered under {profile.company}
              </p>
            )}
            <Button variant="outline" className="mt-3 h-8 rounded-full px-3 text-xs">
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        )}
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

function WishlistSection({ 
  wishlist, 
  onAddToCart, 
  onRemove 
}: { 
  wishlist: Array<{ product: { id: string; name: string; price: number; images: string[] } }>; 
  onAddToCart: (productId: string) => void; 
  onRemove: (productId: string) => void; 
}) {
  const roundToEnding9 = (n: number) => Math.floor(n / 10) * 10 - 1;

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
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item.product.id}
              className="rounded-xl border border-border/60 bg-background p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  SKU: {item.product.id}
                </p>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-muted-foreground hover:text-rose-600 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>
              {item.product.images[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-32 object-contain mb-2 rounded-lg bg-white"
                />
              )}
              <p className="text-sm font-semibold text-foreground line-clamp-2">
                {item.product.name}
              </p>
              <p className="mt-2 text-base font-semibold text-foreground">
                ₹{roundToEnding9(item.product.price).toLocaleString('en-IN')}
              </p>
              <Button 
                onClick={() => onAddToCart(item.product.id)}
                className="mt-3 h-8 w-full rounded-full bg-blue-600 px-3 text-xs text-white border-blue-700 hover:bg-blue-700"
              >
                Add to cart
              </Button>
            </div>
          ))}
        </div>
      )}
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

function SettingsSection({ profile, onSaveSettings }: { profile: ProfileData; onSaveSettings: (settings: { language: string; timezone: string }) => void }) {
  const [language, setLanguage] = useState(profile.language || "en-IN");
  const [timezone, setTimezone] = useState(profile.timezone || "Asia/Kolkata");

  const handleSave = () => {
    onSaveSettings({ language, timezone });
  };

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
            defaultValue={profile.name}
            className="h-11 rounded-xl border-border/80 bg-background"
            disabled
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <Input
            defaultValue={profile.email}
            className="h-11 rounded-xl border-border/80 bg-background"
            disabled
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Language
          </label>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="en-IN">English (India)</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timezone
          </label>
          <select 
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="h-11 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-border/60 pt-4">
        <Button variant="outline" className="h-10 rounded-full px-5">
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="h-10 rounded-full bg-blue-600 px-5 text-white border-blue-700 hover:bg-blue-700"
        >
          Save changes
        </Button>
      </div>
    </SectionShell>
  );
}

interface EditProfileModalProps {
  profile: ProfileData;
  onClose: () => void;
  onSave: (data: Partial<ProfileData>) => void;
}

function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone || '',
    role: profile.role || '',
    company: profile.company || '',
    gstin: profile.gstin || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 rounded-xl border-border/80 bg-background"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-11 rounded-xl border-border/80 bg-background"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Role
            </label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="h-11 rounded-xl border-border/80 bg-background"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Company
            </label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="h-11 rounded-xl border-border/80 bg-background"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              GSTIN
            </label>
            <Input
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              className="h-11 rounded-xl border-border/80 bg-background"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 rounded-full px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-full bg-blue-600 px-5 text-white border-blue-700 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Account() {
  const [active, setActive] = useState<SectionId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as SectionId;
      if (tabParam && ["profile", "orders", "addresses", "billing", "wishlist", "support", "settings", "notifications"].includes(tabParam)) {
        return tabParam;
      }
      if (window.location.hash) {
        const hash = window.location.hash.replace("#", "") as SectionId;
        if (["profile", "orders", "addresses", "billing", "wishlist", "support", "settings", "notifications"].includes(hash)) {
          return hash;
        }
      }
    }
    return "profile";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleUrlTab = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as SectionId;
      if (tabParam && ["profile", "orders", "addresses", "billing", "wishlist", "support", "settings", "notifications"].includes(tabParam)) {
        setActive(tabParam);
      } else if (window.location.hash) {
        const hash = window.location.hash.replace("#", "") as SectionId;
        if (["profile", "orders", "addresses", "billing", "wishlist", "support", "settings", "notifications"].includes(hash)) {
          setActive(hash);
        }
      }
    };
    handleUrlTab();
    window.addEventListener("popstate", handleUrlTab);
    return () => window.removeEventListener("popstate", handleUrlTab);
  }, []);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const { user, setUser, openAuth, logout, wishlist, addToCart, removeFromWishlist } = useStore();
  const [, setLocation] = useLocation();

  const activeItem = navItems.find((n) => n.id === active) ?? navItems[0];

  const handleLogout = () => {
    setLoading(true);
    setProfile(null);
    setAddresses([]);
    setIsEditing(false);
    setAddressModalOpen(false);
    logout();
  };

  const handleDemoLogin = () => {
    const demoUser = {
      userId: "mem_user_demo",
      name: "Demo Engineer",
      email: "demo@synergy.com",
      emailVerified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    };
    setUser(demoUser);
    localStorage.setItem("user", JSON.stringify(demoUser));
    toast({
      title: "Signed in successfully",
      description: "Welcome to your Demo Engineer account!",
    });
  };

  // Fetch profile data
  useEffect(() => {
    if (!user?.userId) {
      setProfile(null);
      setAddresses([]);
      setLoading(false);
      return;
    }

    const fallbackProfileData: ProfileData = {
      name: user.name || "Demo Engineer",
      email: user.email || "demo@synergy.com",
      givenName: user.givenName || user.name?.split(" ")[0] || "Demo",
      familyName: user.familyName || user.name?.split(" ")[1] || "Engineer",
      avatar: user.avatar,
      phone: "+91 91234 56780",
      role: "Hardware & IoT Engineer",
      company: "Synergy Tech Labs",
      gstin: "33AAECS9821F1Z8",
      accountType: "B2B Business",
      totalOrdersValue: 0,
      savedItemsCount: wishlist.length,
      buyerRating: 4.9,
      totalOrdersCount: 0,
      memberSince: new Date("2024-01-15"),
      emailVerified: user.emailVerified ?? true,
      language: "en-IN",
      timezone: "Asia/Kolkata",
    };

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetchApi<{ success: boolean; profile: ProfileData }>(`/users/profile/${user.userId}`);
        if (response.success && response.profile) {
          setProfile(response.profile);
        } else {
          setProfile(fallbackProfileData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfile(fallbackProfileData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, wishlist.length]);

  // Fetch addresses
  useEffect(() => {
    if (!user?.userId) {
      setAddresses([]);
      return;
    }

    // 1. Initial cached or demo addresses
    let cached: Address[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`addresses_${user.userId}`);
        if (stored) {
          cached = JSON.parse(stored);
          if (Array.isArray(cached) && cached.length > 0) {
            setAddresses(cached);
          }
        }
      } catch (err) {
        console.warn("Could not read cached addresses:", err);
      }
    }

    if (cached.length === 0 && (user.userId.includes("demo") || user.email?.includes("demo"))) {
      const demoAddresses: Address[] = [
        {
          _id: "addr_demo_1",
          type: "Office",
          name: "Code Craft / IoT R&D Lab",
          line1: "Synergy Tech Park, Block B, 4th Floor",
          line2: "Electronic City Phase 1, Bengaluru, Karnataka - 560100",
          phone: "+91 91234 56780",
          isDefault: true,
        },
        {
          _id: "addr_demo_2",
          type: "Warehouse",
          name: "Synergy Hardware Fulfillment Hub",
          line1: "Plot 42, Peenya Industrial Area 2nd Stage",
          line2: "Bengaluru, Karnataka - 560058",
          phone: "+91 98765 43210",
          isDefault: false,
        },
      ];
      setAddresses(demoAddresses);
      try {
        localStorage.setItem(`addresses_${user.userId}`, JSON.stringify(demoAddresses));
      } catch {}
    }

    // 2. Fetch from backend API
    const fetchAddresses = async () => {
      try {
        const response = await fetchApi<{ success: boolean; addresses: Address[] }>(`/addresses/${user.userId}`);
        if (response && response.success && Array.isArray(response.addresses) && response.addresses.length > 0) {
          setAddresses(response.addresses);
          try {
            localStorage.setItem(`addresses_${user.userId}`, JSON.stringify(response.addresses));
          } catch {}
        }
      } catch (error) {
        console.warn('Backend addresses fetch note:', error);
      }
    };

    fetchAddresses();
  }, [user?.userId]);

  const handleAddAddress = () => {
    setEditingAddress(undefined);
    setAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (data: Omit<Address, '_id'>) => {
    if (!user?.userId) return;

    const isEdit = Boolean(editingAddress?._id);
    const targetId = editingAddress?._id || `addr_${Date.now()}`;
    const shouldBeDefault = data.isDefault || addresses.length === 0;

    const updatedItem: Address = {
      _id: targetId,
      type: data.type || "Office",
      name: data.name,
      line1: data.line1,
      line2: data.line2 || "",
      phone: data.phone,
      isDefault: shouldBeDefault,
    };

    let nextAddresses: Address[];
    if (isEdit) {
      nextAddresses = addresses.map((a) => {
        if (a._id === targetId || (editingAddress && a.line1 === editingAddress.line1)) {
          return updatedItem;
        }
        return shouldBeDefault ? { ...a, isDefault: false } : a;
      });
    } else {
      nextAddresses = shouldBeDefault
        ? [...addresses.map((a) => ({ ...a, isDefault: false })), updatedItem]
        : [...addresses, updatedItem];
    }

    // Ensure at least one default address exists
    if (!nextAddresses.some((a) => a.isDefault) && nextAddresses.length > 0) {
      nextAddresses[0].isDefault = true;
    }

    setAddresses(nextAddresses);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`addresses_${user.userId}`, JSON.stringify(nextAddresses));
      } catch {}
    }

    setAddressModalOpen(false);
    setEditingAddress(undefined);

    toast({
      title: isEdit ? "Address Updated" : "Address Added",
      description: `Delivery address for ${data.name} has been saved.`,
    });

    try {
      if (isEdit && editingAddress?._id && !editingAddress._id.startsWith("addr_")) {
        await fetchApi(`/addresses/${user.userId}/${editingAddress._id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        const res = await fetchApi<{ success: boolean; address?: Address }>(`/addresses/${user.userId}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (res?.address?._id) {
          setAddresses((prev) =>
            prev.map((a) => (a._id === targetId ? { ...a, _id: res.address!._id } : a))
          );
        }
      }
    } catch (error) {
      console.warn('Backend address save fallback:', error);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.userId || !addressId) return;

    const nextAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === addressId || addr.line1 === addressId,
    }));

    setAddresses(nextAddresses);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`addresses_${user.userId}`, JSON.stringify(nextAddresses));
      } catch {}
    }

    toast({
      title: "Default Address Set",
      description: "This address has been marked as your default shipping location.",
    });

    try {
      if (!addressId.startsWith("addr_")) {
        await fetchApi(`/addresses/${user.userId}/${addressId}/default`, {
          method: 'PATCH',
        });
      }
    } catch (error) {
      console.warn('Backend set default address fallback:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user?.userId || !addressId) return;

    const target = addresses.find((a) => a._id === addressId || a.line1 === addressId);
    let remaining = addresses.filter((a) => a._id !== addressId && a.line1 !== addressId);

    if (target?.isDefault && remaining.length > 0) {
      remaining = remaining.map((a, idx) => (idx === 0 ? { ...a, isDefault: true } : a));
    }

    setAddresses(remaining);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`addresses_${user.userId}`, JSON.stringify(remaining));
      } catch {}
    }

    toast({
      title: "Address Removed",
      description: "The address has been deleted from your saved list.",
    });

    try {
      if (!addressId.startsWith("addr_")) {
        await fetchApi(`/addresses/${user.userId}/${addressId}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.warn('Backend delete address fallback:', error);
    }
  };

  const handleSaveSettings = async (settings: { language: string; timezone: string }) => {
    if (!user?.userId) return;

    try {
      await fetchApi(`/users/settings/${user.userId}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });

      // Refetch profile to get updated settings
      const response = await fetchApi<{ success: boolean; profile: ProfileData }>(`/users/profile/${user.userId}`);
      if (response.success && response.profile) {
        setProfile(response.profile);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleWishlistAddToCart = (productId: string) => {
    const wishlistItem = wishlist.find(item => item.product.id === productId);
    if (wishlistItem) {
      addToCart(wishlistItem.product, 1);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 sm:p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to Your Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Track your shipments, inspect product cards, print official GST invoices, and manage hardware orders.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="h-11 w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md"
              onClick={() => openAuth("signin")}
            >
              Sign In to Your Account
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-sm"
              onClick={handleDemoLogin}
            >
              <Sparkles className="h-4 w-4 mr-1.5 text-blue-600" />
              Continue with Demo Account
            </Button>
            <Link href="/" className="mt-2 text-xs text-muted-foreground hover:text-foreground">
              ← Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-blue-600">{profile.givenName || profile.name.split(" ")[0]}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Manage your profile, orders, addresses, and billing — all in one
            place
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar — details & sub-sections */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-6 space-y-4">
              {/* Identity card */}
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div
                  aria-hidden
                  className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
                />
                <div className="relative px-5 pb-5 pt-0">
                  <div className="-mt-9 mb-3 flex items-end">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-blue-600 to-blue-700 text-xl font-bold text-white shadow-md overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        getInitials(profile.name)
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {profile.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {profile.role || "Customer"}
                    </p>
                  </div>
                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-800/60">
                      <Crown className="h-3 w-3" />
                      {profile.accountType || "B2B Business"}
                    </span>
                    {profile.emailVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/60">
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
                      onClick={handleLogout}
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

            {active === "profile" && <ProfileSection profile={profile} onEdit={() => setIsEditing(true)} />}
            {active === "orders" && <OrdersSection />}
            {active === "addresses" && (
              <AddressesSection 
                addresses={addresses}
                onAdd={handleAddAddress}
                onEdit={handleEditAddress}
                onSetDefault={handleSetDefault}
                onDelete={handleDeleteAddress}
              />
            )}
            {active === "billing" && <BillingSection profile={profile} />}
            {active === "wishlist" && (
              <WishlistSection 
                wishlist={wishlist}
                onAddToCart={handleWishlistAddToCart}
                onRemove={handleRemoveFromWishlist}
              />
            )}
            {active === "support" && <SupportSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "settings" && <SettingsSection profile={profile} onSaveSettings={handleSaveSettings} />}
          </main>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && user && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={async (updatedProfile) => {
            try {
              await fetchApi(`/users/profile/${user.userId}`, {
                method: 'PUT',
                body: JSON.stringify(updatedProfile),
              });
              // Refetch profile
              const response = await fetchApi<{ success: boolean; profile: ProfileData }>(`/users/profile/${user.userId}`);
              if (response.success && response.profile) {
                setProfile(response.profile);
              }
              setIsEditing(false);
            } catch (error) {
              console.error('Failed to update profile:', error);
            }
          }}
        />
      )}

      {/* Address Modal */}
      {addressModalOpen && (
        <AddressModal
          address={editingAddress}
          isFirstAddress={addresses.length === 0}
          onClose={() => {
            setAddressModalOpen(false);
            setEditingAddress(undefined);
          }}
          onSave={handleSaveAddress}
        />
      )}
    </div>
  );
}

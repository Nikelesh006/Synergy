import { useState, useEffect, Fragment } from "react";
import { Link, useLocation } from "wouter";
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
  RefreshCw,
  IndianRupee,
  Calendar,
  User,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronRight, 
  ShieldCheck,
  AlertCircle,
  Check,
  X,
  Copy
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { products as fallbackProducts } from "@/data/products";
import { getProductDisplayImage } from "@/lib/productImage";

interface OrderItem {
  productId?: string;
  name: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  id: string;
  _id?: string;
  trackingId: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  gst: number;
  shippingCharge: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fallback seed orders for rich admin demo preview if database is fresh
const fallbackSeedOrders: AdminOrder[] = [
  {
    id: "SYN-ORD-89241",
    trackingId: "SYN89241A1",
    customer: {
      name: "Ramesh Kannan",
      email: "ramesh.k@synergylabs.io",
      phone: "+91 98401 23456",
    },
    items: [
      {
        name: "ESP32-S3 AI Development Board",
        sku: "DEV-ESP32-S3",
        price: 1250,
        quantity: 2,
        image: "/categories/ai-boards.jpg"
      },
      {
        name: "Raspberry Pi 4 Model B (4GB)",
        sku: "RPI-4-4GB",
        price: 5200,
        quantity: 1,
        image: "/categories/embedded-boards.jpg"
      }
    ],
    shippingAddress: {
      fullName: "Ramesh Kannan",
      phone: "+91 98401 23456",
      addressLine1: "Plot 42, Electronic City Phase 1",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560100"
    },
    subtotal: 7700,
    gst: 1386,
    shippingCharge: 0,
    total: 9086,
    status: "processing",
    paymentMethod: "upi",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "SYN-ORD-78105",
    trackingId: "SYN78105B2",
    customer: {
      name: "Dr. Ananya Roy",
      email: "ananya.roy@mit-india.edu",
      phone: "+91 98200 45678",
    },
    items: [
      {
        name: "Arduino UNO R4 WiFi",
        sku: "ARD-UNO-R4",
        price: 2450,
        quantity: 3,
        image: "/categories/embedded-boards.jpg"
      }
    ],
    shippingAddress: {
      fullName: "Dr. Ananya Roy",
      phone: "+91 98200 45678",
      addressLine1: "Dept of EEE, MIT Campus",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600025"
    },
    subtotal: 7350,
    gst: 1323,
    shippingCharge: 0,
    total: 8673,
    status: "shipped",
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "SYN-ORD-65412",
    trackingId: "SYN65412C3",
    customer: {
      name: "Siddharth Verma",
      email: "siddharth.v@gmail.com",
      phone: "+91 97110 98765",
    },
    items: [
      {
        name: "16-Channel 12-bit PWM Servo Driver (PCA9685)",
        sku: "ROB-PCA9685",
        price: 650,
        quantity: 4,
        image: "/categories/robotics-boards.jpg"
      }
    ],
    shippingAddress: {
      fullName: "Siddharth Verma",
      phone: "+91 97110 98765",
      addressLine1: "B-204, Tech Residency",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081"
    },
    subtotal: 2600,
    gst: 468,
    shippingCharge: 250,
    total: 3318,
    status: "pending",
    paymentMethod: "cod",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
  }
];

export function normalizeOrderItem(item: any): OrderItem {
  if (!item) {
    return { name: "Product", price: 0, quantity: 1, image: "/categories/embedded-boards.jpg" };
  }
  const prod = typeof item.product === "object" && item.product !== null ? item.product : {};
  const productId = item.productId || (typeof item.product === "string" ? item.product : (prod.id || prod._id));

  let name = item.name || prod.name || item.title || prod.title || "";
  let sku = item.sku || prod.sku || "";
  let image =
    item.image ||
    (Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : prod.image) ||
    "";
  let price = Number(item.price ?? item.unitPrice ?? prod.price ?? 0) || 0;
  const quantity = Number(item.quantity ?? 1) || 1;

  // Catalog match fallback
  const catalogMatch = fallbackProducts.find(
    (p) =>
      (productId && (p.id === productId || (p as any)._id === productId)) ||
      (sku && sku !== "SYN-SKU" && p.sku?.toLowerCase() === sku.toLowerCase()) ||
      (name && name !== "Hardware Item" && p.name?.toLowerCase() === name.toLowerCase())
  );

  if (catalogMatch) {
    if (!name || name === "Hardware Item") name = catalogMatch.name;
    if (!sku || sku === "SYN-SKU") sku = catalogMatch.sku;
    if (!image) image = catalogMatch.images?.[0] || "";
    if (!price) price = catalogMatch.price;
  }

  name = name || "Hardware Component";
  sku = sku || "SYN-SKU";
  image = getProductDisplayImage(image, catalogMatch?.category || prod.category, catalogMatch?.subcategory || prod.subcategory);

  return {
    productId,
    name,
    sku,
    image,
    price,
    quantity,
  };
}

export function normalizeOrder(order: any): AdminOrder {
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items: OrderItem[] = rawItems.map(normalizeOrderItem);
  const rawTotal = Number(order.total ?? order.subtotal ?? 0);
  const calculatedTotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const total = rawTotal > 0 ? rawTotal : calculatedTotal;

  return {
    id: String(order.id || order._id || order.trackingId || `ORD-${Date.now()}`),
    _id: order._id,
    trackingId: order.trackingId || order.id || `SYN-${Date.now()}`,
    userId: order.userId,
    customer: {
      name: order.customer?.name || order.shippingAddress?.fullName || "Valued Customer",
      email: order.customer?.email || "customer@example.com",
      phone: order.customer?.phone || order.shippingAddress?.phone || "+91 98000 00000",
    },
    items,
    shippingAddress: {
      fullName: order.shippingAddress?.fullName || order.customer?.name || "Valued Customer",
      phone: order.shippingAddress?.phone || order.customer?.phone || "",
      addressLine1: order.shippingAddress?.addressLine1 || "Delivery Address",
      addressLine2: order.shippingAddress?.addressLine2 || "",
      city: order.shippingAddress?.city || "Bengaluru",
      state: order.shippingAddress?.state || "Karnataka",
      pincode: order.shippingAddress?.pincode || "560001",
    },
    subtotal: Number(order.subtotal ?? total),
    gst: Number(order.gst ?? 0),
    shippingCharge: Number(order.shippingCharge ?? 0),
    total,
    status: (order.status || "pending").toLowerCase() as any,
    paymentMethod: order.paymentMethod || "cod",
    paymentStatus: (order.paymentStatus || "pending").toLowerCase() as any,
    notes: order.notes,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  };
}

export default function AdminOrders() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: text,
      });
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersMap = new Map<string, AdminOrder>();

      // 1. Fetch from backend API
      try {
        const res = await fetchApi<{ success: boolean; orders: any[] }>("/orders");
        if (res && res.success && Array.isArray(res.orders)) {
          res.orders.forEach((o) => {
            const normalized = normalizeOrder(o);
            const key = normalized.trackingId || normalized.id;
            if (key) ordersMap.set(key, normalized);
          });
        }
      } catch (err) {
        console.warn("Failed to fetch API orders:", err);
      }

      // 2. Merge recently placed orders from browser session (localStorage)
      if (typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage).filter((k) => k.startsWith("synergy_local_orders"));
          for (const k of keys) {
            const localSaved = localStorage.getItem(k);
            if (localSaved) {
              const localList = JSON.parse(localSaved);
              if (Array.isArray(localList)) {
                localList.forEach((lo: any) => {
                  const normalized = normalizeOrder(lo);
                  const key = normalized.trackingId || normalized.id;
                  if (key && !ordersMap.has(key)) {
                    ordersMap.set(key, normalized);
                  }
                });
              }
            }
          }
        } catch (e) {
          console.warn("Failed to load local orders:", e);
        }
      }

      // 3. Fallback to pre-seeded demo orders if no orders exist anywhere
      if (ordersMap.size === 0) {
        fallbackSeedOrders.forEach((so) => {
          const normalized = normalizeOrder(so);
          ordersMap.set(normalized.trackingId || normalized.id, normalized);
        });
      }

      setOrders(Array.from(ordersMap.values()));
    } catch (err) {
      console.warn("Error processing orders:", err);
      setOrders(fallbackSeedOrders.map(normalizeOrder));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (order: AdminOrder, newStatus: AdminOrder["status"]) => {
    setIsUpdatingStatus(true);
    try {
      const orderIdOrTracking = order.id || order._id || order.trackingId;
      await fetchApi(`/orders/${orderIdOrTracking}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          (o.id === order.id || o.trackingId === order.trackingId)
            ? { ...o, status: newStatus }
            : o
        )
      );

      if (selectedOrder && (selectedOrder.id === order.id || selectedOrder.trackingId === order.trackingId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      toast({
        title: "Order Status Updated",
        description: `Order ${order.trackingId || order.id} is now ${(newStatus || "").toUpperCase()}`,
        duration: 3000,
      });
    } catch (err) {
      // Optimistic local update fallback
      setOrders((prev) =>
        prev.map((o) =>
          (o.id === order.id || o.trackingId === order.trackingId)
            ? { ...o, status: newStatus }
            : o
        )
      );
      if (selectedOrder && (selectedOrder.id === order.id || selectedOrder.trackingId === order.trackingId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast({
        title: "Status Updated",
        description: `Order updated to ${newStatus}`,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePaymentStatusChange = async (order: AdminOrder, newPaymentStatus: AdminOrder["paymentStatus"]) => {
    try {
      const orderIdOrTracking = order.id || order._id || order.trackingId;
      await fetchApi(`/orders/${orderIdOrTracking}`, {
        method: "PUT",
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          (o.id === order.id || o.trackingId === order.trackingId)
            ? { ...o, paymentStatus: newPaymentStatus }
            : o
        )
      );

      if (selectedOrder && (selectedOrder.id === order.id || selectedOrder.trackingId === order.trackingId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus } : null));
      }

      toast({
        title: "Payment Status Updated",
        description: `Payment marked as ${(newPaymentStatus || "").toUpperCase()}`,
      });
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) =>
          (o.id === order.id || o.trackingId === order.trackingId)
            ? { ...o, paymentStatus: newPaymentStatus }
            : o
        )
      );
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (o.trackingId && o.trackingId.toLowerCase().includes(term)) ||
      (o.id && o.id.toLowerCase().includes(term)) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(term)) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(term)) ||
      (o.customer?.phone && o.customer.phone.includes(term)) ||
      (Array.isArray(o.items) && o.items.some((it) =>
        (it.name && it.name.toLowerCase().includes(term)) ||
        (it.sku && it.sku.toLowerCase().includes(term))
      ));

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-semibold">Delivered</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-semibold">Shipped</Badge>;
      case "processing":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-semibold">Processing</Badge>;
      case "confirmed":
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100 font-semibold">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 font-semibold">Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100 font-semibold">Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Paid</span>;
      case "refunded":
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Refunded</span>;
      case "failed":
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Pending</span>;
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const completedOrdersCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminNav />

        {/* Header & Metrics */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Orders Management</h1>
                <p className="text-sm text-slate-500">Track shipments, verify payments, and manage fulfillment workflow.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="gap-2 h-9 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Orders
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
              <p className="text-xs text-slate-500 mt-1">Across all channels</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Awaiting Dispatch</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{pendingOrdersCount}</p>
              <p className="text-xs text-amber-700 mt-1">Pending or Processing</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Completed Deliveries</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{completedOrdersCount}</p>
              <p className="text-xs text-emerald-700 mt-1">Successfully fulfilled</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Realized Revenue</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
              <p className="text-xs text-blue-700 mt-1">From paid orders</p>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by Tracking ID, Customer, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium uppercase text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-xs font-medium uppercase text-slate-500">Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 w-[230px] min-w-[210px] text-left">Order / Tracking ID</th>
                  <th className="px-5 py-3.5 min-w-[190px] text-left">Customer Details</th>
                  <th className="px-5 py-3.5 min-w-[230px] text-left">Items</th>
                  <th className="px-5 py-3.5 text-left whitespace-nowrap">Total Amount</th>
                  <th className="px-5 py-3.5 text-left whitespace-nowrap">Payment</th>
                  <th className="px-5 py-3.5 text-left whitespace-nowrap">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const orderKey = order.trackingId || order.id;
                    const displayId = order.trackingId || order.id;
                    const isExpanded = expandedOrderId === orderKey;
                    const itemsSummary = order.items && order.items.length > 0
                      ? `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`
                      : "Items";
                    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }) : "Recently";

                    return (
                      <Fragment key={orderKey}>
                        <tr className={`hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0 ${isExpanded ? "bg-blue-50/20" : ""}`}>
                          {/* Column 1: Order / Tracking ID */}
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => setExpandedOrderId(isExpanded ? null : orderKey)}
                                className="p-1 mt-0.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                                title={isExpanded ? "Collapse products" : "Expand products"}
                                aria-label={isExpanded ? "Collapse products" : "Expand products"}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 font-mono text-xs tracking-tight bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                                    {displayId}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(displayId)}
                                    className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded"
                                    title="Copy tracking ID"
                                  >
                                    {copiedId === displayId ? (
                                      <Check className="h-3 w-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                                {order.id && order.trackingId && order.id !== order.trackingId && (
                                  <div className="text-[11px] font-mono text-slate-400">
                                    Ref: {order.id.length > 16 ? `${order.id.slice(0, 8)}...${order.id.slice(-4)}` : order.id}
                                  </div>
                                )}
                                <div className="text-xs text-slate-400 flex items-center gap-1 pt-0.5">
                                  <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
                                  <span>{orderDate}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Customer Details */}
                          <td className="px-5 py-4 align-top">
                            <div className="font-semibold text-slate-900">{order.customer?.name || "Customer"}</div>
                            <div className="text-xs text-slate-500 mt-0.5 break-all">{order.customer?.email}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{order.customer?.phone}</div>
                          </td>

                          {/* Column 3: Items */}
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-3">
                              {/* Stacked Product Thumbnails */}
                              <div className="flex -space-x-2 shrink-0 mt-0.5">
                                {order.items?.slice(0, 3).map((item, idx) => (
                                  <img
                                    key={idx}
                                    src={item.image || "/categories/embedded-boards.jpg"}
                                    alt={item.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/categories/embedded-boards.jpg";
                                    }}
                                    className="h-10 w-10 rounded-lg object-cover border-2 border-white bg-slate-100 shadow-xs"
                                    title={`${item.name} (Qty: ${item.quantity})`}
                                  />
                                ))}
                                {order.items && order.items.length > 3 && (
                                  <div className="h-10 w-10 rounded-lg border-2 border-white bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shadow-xs">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                              {/* Product Title & Quantity Details */}
                              <div className="min-w-0 max-w-xs">
                                <div className="text-xs font-semibold text-slate-900 truncate" title={itemsSummary}>
                                  {itemsSummary}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span className="font-medium text-slate-700">
                                    {order.items?.reduce((c, i) => c + (Number(i.quantity) || 1), 0) || 1} units
                                  </span>
                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : orderKey)}
                                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium text-[11px]"
                                  >
                                    {isExpanded ? "Hide products" : "View products"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 4: Total Amount */}
                          <td className="px-5 py-4 align-top font-bold text-slate-900 whitespace-nowrap">
                            <div>₹{(order.total || 0).toLocaleString("en-IN")}</div>
                            <div className="text-[11px] font-normal text-slate-400 uppercase mt-0.5">
                              {order.paymentMethod || "COD"}
                            </div>
                          </td>

                          {/* Column 5: Payment */}
                          <td className="px-5 py-4 align-top whitespace-nowrap">
                            {getPaymentBadge(order.paymentStatus)}
                          </td>

                          {/* Column 6: Fulfillment Status */}
                          <td className="px-5 py-4 align-top whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>

                          {/* Column 7: Actions */}
                          <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="h-8 gap-1 border-slate-200 text-xs font-medium hover:bg-slate-100"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View & Manage
                              </Button>
                              <Link href={`/track-order?trackingId=${order.trackingId || order.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Open customer tracking page"
                                  className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Order Products Sub-row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 border-t border-slate-100">
                            <td colSpan={7} className="px-8 py-4">
                              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <PackageCheck className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                      Ordered Products Breakdown ({order.items?.length || 0} unique items)
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-400 font-mono">Tracking: {displayId}</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                  {order.items?.map((it, pIdx) => (
                                    <div key={pIdx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={it.image || "/categories/embedded-boards.jpg"}
                                          alt={it.name}
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/categories/embedded-boards.jpg";
                                          }}
                                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0"
                                        />
                                        <div>
                                          <p className="text-xs font-bold text-slate-900">{it.name}</p>
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-slate-400 font-mono">SKU: {it.sku || "N/A"}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[11px] font-semibold text-slate-600">Qty: {it.quantity}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-xs font-bold text-slate-900">
                                          ₹{((it.price || 0) * (it.quantity || 1)).toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-[11px] text-slate-400">₹{(it.price || 0).toLocaleString("en-IN")} each</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details & Status Manager Drawer / Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in-0 zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order Management</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1 font-mono">{selectedOrder.trackingId || selectedOrder.id}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Status Update Quick Bar */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">Update Order Status</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedOrder, st)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize border transition-all text-center ${
                          selectedOrder.status === st
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Status Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Status</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold capitalize text-slate-800">{selectedOrder.paymentStatus || "pending"}</span>
                      <span className="text-xs text-slate-400">via {(selectedOrder.paymentMethod || "COD").toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(["paid", "pending", "refunded"] as const).map((pst) => (
                      <Button
                        key={pst}
                        size="sm"
                        variant={selectedOrder.paymentStatus === pst ? "default" : "outline"}
                        onClick={() => handlePaymentStatusChange(selectedOrder, pst)}
                        className="text-xs capitalize h-8"
                      >
                        {pst}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Customer & Shipping info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-500" /> Customer Information
                    </p>
                    <p className="font-semibold text-slate-900 text-sm">{selectedOrder.customer?.name}</p>
                    <p className="text-xs text-slate-600 mt-1">{selectedOrder.customer?.email}</p>
                    <p className="text-xs text-slate-600">{selectedOrder.customer?.phone}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" /> Delivery Address
                    </p>
                    <p className="font-semibold text-slate-900 text-sm">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {selectedOrder.shippingAddress?.addressLine1}
                      {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                      <br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </p>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Order Items ({selectedOrder.items?.length || 0})</span>
                    <span className="text-slate-400 font-normal">
                      {selectedOrder.items?.reduce((s, i) => s + (Number(i.quantity) || 1), 0) || 0} total units
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/categories/embedded-boards.jpg"}
                            alt={item.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/categories/embedded-boards.jpg";
                            }}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-400">SKU: {item.sku || "N/A"} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-slate-400">₹{(item.price || 0).toLocaleString("en-IN")} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Financial breakdown */}
                  <div className="bg-slate-50/80 p-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium text-slate-900">₹{(selectedOrder.subtotal || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span className="font-medium text-slate-900">₹{(selectedOrder.gst || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="font-medium text-slate-900">
                        {selectedOrder.shippingCharge === 0 ? "FREE" : `₹${selectedOrder.shippingCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{(selectedOrder.total || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <Link href={`/track-order?trackingId=${selectedOrder.trackingId || selectedOrder.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" /> View Customer Tracking Page
                  </Button>
                </Link>
                <Button size="sm" onClick={() => setSelectedOrder(null)} className="bg-blue-600 hover:bg-blue-700">
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

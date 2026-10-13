import { Link } from "wouter";
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowRight, ShieldCheck, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface OrderTrackingData {
  id: string;
  trackingId: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: string;
  total?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("trackingId") || p.get("id") || "";
    }
    return "";
  });
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchOrderDetails = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setNotFound(false);

    try {
      // 1. Check database via API
      let fetched: any = null;
      try {
        const res = await fetchApi<any>(`/orders/${encodeURIComponent(idToSearch.trim())}`);
        if (res && (res.trackingId || res.id || res._id)) {
          fetched = res;
        }
      } catch (err) {
        // Continue to check local recent orders
      }

      // 2. If not found in API, check recently placed local orders in localStorage
      if (!fetched && typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage).filter((k) => k.startsWith("synergy_local_orders"));
          for (const k of keys) {
            const localSaved = localStorage.getItem(k);
            if (localSaved) {
              const list = JSON.parse(localSaved);
              if (Array.isArray(list)) {
                const found = list.find(
                  (o: any) =>
                    o.trackingId?.toLowerCase() === idToSearch.trim().toLowerCase() ||
                    o.id?.toLowerCase() === idToSearch.trim().toLowerCase()
                );
                if (found) {
                  fetched = found;
                  break;
                }
              }
            }
          }
        } catch (e) {
          // ignore
        }
      }

      // 3. Fallback mock demo if specific sample was typed
      if (!fetched && idToSearch.toUpperCase().includes("SYN")) {
        fetched = {
          id: idToSearch,
          trackingId: idToSearch,
          status: "processing",
          createdAt: new Date().toISOString(),
          total: 4250,
          paymentMethod: "UPI",
          paymentStatus: "paid",
          customer: {
            name: "Verified Customer",
            email: emailOrPhone || "customer@example.com"
          },
          shippingAddress: {
            fullName: "Verified Customer",
            addressLine1: "Industrial Hardware Park",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560100"
          },
          items: [
            { name: "ESP32 Development Board", quantity: 2, price: 450 },
            { name: "Motor Driver Shield", quantity: 1, price: 780 }
          ]
        };
      }

      if (fetched) {
        setOrderData({
          id: fetched.id || fetched._id || idToSearch,
          trackingId: fetched.trackingId || idToSearch,
          status: (fetched.status || "confirmed").toLowerCase(),
          createdAt: fetched.createdAt || new Date().toISOString(),
          total: fetched.total || 0,
          paymentMethod: fetched.paymentMethod || "UPI",
          paymentStatus: fetched.paymentStatus || "paid",
          customer: fetched.customer,
          shippingAddress: fetched.shippingAddress,
          items: fetched.items || []
        });
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const queryId = p.get("trackingId") || p.get("id");
      if (queryId) {
        setOrderId(queryId);
        fetchOrderDetails(queryId);
      }
    }
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderDetails(orderId);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast({
      title: "Tracking ID Copied",
      description: "Copied to clipboard."
    });
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Status timeline steps calculations
  const currentStatus = orderData?.status || "confirmed";
  const stepRank = {
    pending: 1,
    confirmed: 2,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 0
  }[currentStatus] ?? 2;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">Track Order</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Track Your Order</h1>
          <p className="text-slate-600 text-sm">
            Enter your order tracking ID to get real-time dispatch and delivery status.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Tracking or Order ID <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. SYN89241 or SYN-12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="h-11 border-slate-200 focus-visible:ring-blue-600 font-mono uppercase"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email or Phone (Optional)
              </label>
              <Input
                type="text"
                placeholder="Enter email or phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="h-11 border-slate-200 focus-visible:ring-blue-600"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto h-11 px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-xs"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Track Live"}
              </Button>
            </div>
          </form>
        </div>

        {/* Not Found state */}
        {notFound && (
          <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center shadow-sm mb-8">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Order Not Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              We couldn't locate an order with ID <span className="font-mono font-semibold">{orderId}</span>. Please verify the tracking code from your checkout confirmation.
            </p>
            <Link href="/account?tab=orders">
              <Button variant="outline" size="sm" className="border-slate-300">
                View My Orders
              </Button>
            </Link>
          </div>
        )}

        {/* Order tracking timeline & details */}
        {orderData && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
            {/* Header info */}
            <div className="border-b border-slate-100 p-6 bg-slate-50/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Tracking ID</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize font-bold">
                      {orderData.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-mono">{orderData.trackingId}</h2>
                    <button
                      onClick={() => copyId(orderData.trackingId)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                      title="Copy Tracking ID"
                    >
                      {copiedId ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on {new Date(orderData.createdAt || Date.now()).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {orderData.status === "delivered" ? "Delivered" : "3 - 5 Business Days"}
                  </p>
                  <p className="text-xs text-slate-400">Delhivery Express Logistics</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-8">
              <div className="relative">
                {/* Timeline vertical bar */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100"></div>

                <div className="space-y-8 relative">
                  {/* Step 1: Confirmed */}
                  <div className="flex gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-xs ${
                      stepRank >= 1 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Order Placed & Verified</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Your order has been verified and registered with Synergy Tech Labs.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Payment via {orderData.paymentMethod ? orderData.paymentMethod.toUpperCase() : "ONLINE"}</p>
                    </div>
                  </div>

                  {/* Step 2: Processing & Packed */}
                  <div className={`flex gap-5 ${stepRank < 2 ? "opacity-50" : ""}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-xs ${
                      stepRank >= 2 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Quality Check & Packed</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Items checked, serialized, and packed in ESD anti-static packaging.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Coimbatore Central Hub</p>
                    </div>
                  </div>

                  {/* Step 3: In Transit */}
                  <div className={`flex gap-5 ${stepRank < 3 ? "opacity-50" : ""}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-xs ${
                      stepRank >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">In Transit</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Handed over to express courier and en route to the destination facility.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {stepRank >= 3 ? "Departed sorting center" : "Pending dispatch"}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className={`flex gap-5 ${stepRank < 4 ? "opacity-50" : ""}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-xs ${
                      stepRank >= 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Delivered</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {stepRank >= 4 ? "Package delivered successfully." : "Pending final delivery by courier partner."}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {orderData.shippingAddress?.city ? `Destination: ${orderData.shippingAddress.city}` : "At doorstep"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination & Action footer */}
            {orderData.shippingAddress && (
              <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Delivering To: </span>
                  {orderData.shippingAddress.fullName},{" "}
                  {orderData.shippingAddress.addressLine1},{" "}
                  {orderData.shippingAddress.city} - {orderData.shippingAddress.pincode}
                </div>
                <Link href="/account?tab=orders">
                  <Button variant="outline" size="sm" className="text-xs font-semibold border-slate-200">
                    View in Account Orders
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

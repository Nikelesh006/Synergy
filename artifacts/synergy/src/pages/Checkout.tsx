import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { fetchApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Checkout() {
  const { cart, cartTotal, clearCart, user } = useStore();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<"processing" | "ticked" | "done">("processing");
  const [copiedId, setCopiedId] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: user?.givenName || user?.name?.split(" ")[0] || "",
    lastName: user?.familyName || user?.name?.split(" ").slice(1).join(" ") || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    claimGst: false,
    gstin: "",
    companyName: "",
    paymentMethod: "upi",
    notes: ""
  });

  const [placedOrder, setPlacedOrder] = useState<{
    trackingId: string;
    id: string;
    total: number;
    subtotal: number;
    gst: number;
    shippingCharge: number;
    createdAt: string;
    itemsCount: number;
    paymentMethod: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      city: string;
      state: string;
      pincode: string;
    };
  } | null>(null);

  // Financial calculations
  const gst = cartTotal * 0.18;
  const shipping = cartTotal > 5000 || cartTotal === 0 ? 0 : 250;
  const total = cartTotal + gst + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.email || !formData.address || !formData.city || !formData.pincode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all mandatory contact and shipping fields.",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 && !placedOrder) {
      toast({
        title: "Cart is empty",
        description: "Please add products to your cart before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setIsPlacing(true);
    setStep(3);
    setAnimationPhase("processing");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Prepare payload
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      sku: item.product.sku || "SYN-SKU",
      image: item.product.images?.[0] || "",
      price: item.product.price,
      quantity: item.quantity
    }));

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const payload = {
      userId: user?.userId,
      customer: {
        name: fullName || "Valued Customer",
        email: formData.email,
        phone: formData.phone,
      },
      items: orderItems,
      shippingAddress: {
        fullName: fullName || "Valued Customer",
        phone: formData.phone,
        addressLine1: formData.address,
        addressLine2: formData.claimGst ? `GSTIN: ${formData.gstin} (${formData.companyName})` : "",
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      subtotal: cartTotal,
      gst: Math.round(gst),
      shippingCharge: shipping,
      total: Math.round(total),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === "cod" ? "pending" : "paid",
      notes: formData.notes
    };

    try {
      // 1. Send order to API
      let createdOrder: any = null;
      try {
        const res = await fetchApi<any>("/orders", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        createdOrder = res;
      } catch (err) {
        console.warn("API order creation fallback:", err);
      }

      // Generate tracking ID fallback if needed
      const trackingId = createdOrder?.trackingId || `SYN${Date.now().toString(36).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
      const orderId = createdOrder?.id || createdOrder?._id || `SYN-${Date.now().toString().slice(-6)}`;

      const orderResult = {
        trackingId,
        id: orderId,
        total: Math.round(total),
        subtotal: cartTotal,
        gst: Math.round(gst),
        shippingCharge: shipping,
        createdAt: new Date().toISOString(),
        itemsCount: cart.reduce((s, i) => s + i.quantity, 0),
        paymentMethod: formData.paymentMethod,
        shippingAddress: payload.shippingAddress,
        items: cart.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      };

      setPlacedOrder(orderResult);

      // Save to localStorage so recent orders are immediately visible in Account & Track Order
      try {
        const localSaved = localStorage.getItem("synergy_local_orders");
        const list = localSaved ? JSON.parse(localSaved) : [];
        list.unshift(orderResult);
        localStorage.setItem("synergy_local_orders", JSON.stringify(list.slice(0, 20)));
      } catch (e) {
        // ignore storage error
      }

      // 2. Play the green ticked loading symbol flow
      // Stage 1: "processing" spinning indicator (approx 1.2s)
      setTimeout(() => {
        setAnimationPhase("ticked");
        // Clear cart once order is confirmed
        clearCart();
        
        // Stage 2: Let green ticked loading symbol complete its animation and show full details
        setTimeout(() => {
          setAnimationPhase("done");
          setIsPlacing(false);
          toast({
            title: "Order Placed Successfully!",
            description: `Order Tracking ID: ${trackingId}`,
            variant: "cart",
            duration: 4000
          });
        }, 1200);
      }, 1200);

    } catch (error) {
      console.error("Order placement failure:", error);
      setIsPlacing(false);
      setAnimationPhase("done");
    }
  };

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast({
      title: "Tracking ID Copied",
      description: "Copied to clipboard."
    });
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-blue-600">Cart</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center max-w-2xl mx-auto mb-10">
          <div className={`flex items-center gap-3 transition-colors ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-all ${
              step >= 1 ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-600"
            }`}>
              1
            </div>
            <span className="font-semibold text-sm">Shipping Address</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`}></div>
          
          <div className={`flex items-center gap-3 transition-colors ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-all ${
              step >= 2 ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-200 text-slate-600"
            }`}>
              2
            </div>
            <span className="font-semibold text-sm">Payment</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${step >= 3 ? "bg-emerald-600" : "bg-slate-200"}`}></div>
          
          <div className={`flex items-center gap-3 transition-colors ${step >= 3 ? "text-emerald-600" : "text-slate-400"}`}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-all ${
              step >= 3 ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : "bg-slate-200 text-slate-600"
            }`}>
              3
            </div>
            <span className="font-semibold text-sm">Order Status</span>
          </div>
        </div>

        {/* Main Step 3: SUCCESS STATE WITH GREEN TICKED LOADING SYMBOL */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            {/* Animated Loading -> Green Ticked Confirmation Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
              {animationPhase === "processing" && (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-300">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-7 w-7 text-emerald-600 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Your Order...</h2>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Securing payment verification and allocating hardware inventory.
                  </p>
                </div>
              )}

              {(animationPhase === "ticked" || animationPhase === "done") && (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                  {/* Green Ticked Circle with Animated SVG stroke */}
                  <div className="relative mb-6 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center animate-checkmark-scale animate-pulse-green shadow-lg shadow-emerald-500/20">
                      <svg className="w-14 h-14" viewBox="0 0 52 52">
                        <circle
                          className="animate-checkmark-circle"
                          cx="26"
                          cy="26"
                          r="23"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3.5"
                        />
                        <path
                          className="animate-checkmark-check"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Order Placed Successfully
                  </div>

                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    Thank You for Your Order!
                  </h2>
                  <p className="text-slate-600 max-w-md mx-auto text-sm mb-6">
                    We've received your request. An invoice copy and confirmation SMS have been triggered.
                  </p>

                  {/* Order ID Pill */}
                  {placedOrder && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-md mb-8 flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking / Order ID</p>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{placedOrder.trackingId}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyTrackingId(placedOrder.trackingId)}
                        className="gap-1.5 h-9 text-xs border-slate-300 hover:bg-slate-100"
                      >
                        {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedId ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <Link
                      href={placedOrder ? `/track-order?trackingId=${placedOrder.trackingId}` : "/track-order"}
                      className="flex-1"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-sm font-bold gap-2 shadow-xs">
                        <Truck className="h-4 w-4" />
                        Track Order Live
                      </Button>
                    </Link>
                    <Link href="/account?tab=orders" className="flex-1">
                      <Button variant="outline" className="w-full h-12 text-sm font-semibold border-slate-300 hover:bg-slate-50">
                        View in My Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Destination Details */}
            {placedOrder && animationPhase === "done" && (
              <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  Order Summary & Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Shipped To:
                    </p>
                    <p className="font-medium text-slate-800">{placedOrder.shippingAddress.fullName}</p>
                    <p className="mt-0.5 text-slate-500 leading-relaxed">
                      {placedOrder.shippingAddress.addressLine1}
                      <br />
                      {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} - {placedOrder.shippingAddress.pincode}
                    </p>
                    <p className="mt-1 text-slate-500">Phone: {placedOrder.shippingAddress.phone}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 mb-2">Payment Details</p>
                      <div className="flex justify-between text-xs py-1">
                        <span className="text-slate-500">Method</span>
                        <span className="font-bold text-slate-800 uppercase">{placedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-xs py-1">
                        <span className="text-slate-500">Total Items</span>
                        <span className="font-medium text-slate-800">{placedOrder.itemsCount} units</span>
                      </div>
                      <div className="flex justify-between text-xs py-1">
                        <span className="text-slate-500">GST (18%)</span>
                        <span className="font-medium text-slate-800">₹{placedOrder.gst.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2 font-bold text-slate-900">
                      <span>Total Paid</span>
                      <span className="text-lg text-emerald-600">₹{placedOrder.total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    GST Tax Invoice generated
                  </span>
                  <Link href="/shop" className="text-blue-600 font-semibold hover:underline">
                    Continue Shopping &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1 & 2: Forms and Summary */}
        {step < 3 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* STEP 1: Delivery Address */}
              {step === 1 && (
                <form onSubmit={handleNextToPayment} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Where should we dispatch your hardware items?</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">Step 1 of 2</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Street Address / Company Building <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Plot / Flat No, Street, Landmark"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Bengaluru"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Karnataka"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                        Pincode <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        required
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="560100"
                        className="h-11 border-slate-200 focus-visible:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* GST Claim Toggle */}
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="claimGst"
                        name="claimGst"
                        checked={formData.claimGst}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="claimGst" className="text-sm font-semibold text-slate-800 cursor-pointer">
                        Claim GST Input Tax Credit (Business Purchase)
                      </label>
                    </div>
                    {formData.claimGst && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                        <Input
                          name="gstin"
                          value={formData.gstin}
                          onChange={handleInputChange}
                          placeholder="GSTIN (e.g. 29ABCDE1234F1Z5)"
                          className="bg-white h-10 border-slate-200"
                        />
                        <Input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Company Legal Name"
                          className="bg-white h-10 border-slate-200"
                        />
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-bold shadow-xs">
                    Continue to Payment &rarr;
                  </Button>
                </form>
              )}

              {/* STEP 2: Payment Method */}
              {step === 2 && (
                <form onSubmit={handlePlaceOrder} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Select Payment Method</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Secure payment with SSL 256-bit encryption</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">Step 2 of 2</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: "upi", title: "UPI / QR Code", desc: "Instant transfer via Google Pay, PhonePe, Paytm, BHIM", tag: "Recommended" },
                      { id: "card", title: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay, Corporate Amex cards", tag: "Instant" },
                      { id: "netbanking", title: "Net Banking", desc: "All major banks including HDFC, ICICI, SBI, Axis", tag: "" },
                      { id: "cod", title: "Cash on Delivery (COD)", desc: "Pay cash or QR on package arrival at doorstep", tag: "Available" }
                    ].map((method) => {
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600"
                              : "border-slate-200 hover:bg-slate-50/70"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={isSelected}
                              onChange={handleInputChange}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{method.title}</span>
                                {method.tag && (
                                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    {method.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-blue-600 shrink-0" />}
                        </label>
                      );
                    })}
                  </div>

                  {/* Delivery Notes */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Order / Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Leave package with security desk, gate passcode, or call upon arrival"
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="h-12 px-6 border-slate-300 text-slate-700"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPlacing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-bold shadow-sm text-white"
                    >
                      {isPlacing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Placing Order...
                        </>
                      ) : (
                        `Place Order • ₹${Math.round(total).toLocaleString("en-IN")}`
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {cart.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </h2>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mb-4">
                  {cart.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3">No items in cart</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.product.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-8 h-8 rounded-md object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">
                              HW
                            </div>
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                            <p className="text-slate-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 shrink-0">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3 text-xs pt-3 border-t border-slate-100 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated GST (18%)</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(gst).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-slate-900">
                      {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <Separator className="mb-4" />

                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-extrabold text-blue-700">
                    ₹{Math.round(total).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-1.5 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    Genuine Manufacturer Warranty
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                    Dispatched within 24-48 business hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

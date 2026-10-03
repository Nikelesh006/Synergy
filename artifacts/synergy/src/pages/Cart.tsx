import { Link } from "wouter";
import { useMemo, useState } from "react";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Tag,
  Truck,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  Lock,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const itemCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart]
  );

  const subtotal = cartTotal;
  const gst = subtotal * 0.18;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const discount = appliedCoupon ? Math.round(subtotal * 0.05) : 0;
  const finalTotal = subtotal + gst + shipping - discount;

  const freeShippingRemaining = Math.max(0, 5000 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 5000) * 100);

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm">
              <ShoppingBag className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-6 bg-foreground/30" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Your Cart
              </span>
              <span className="h-px w-6 bg-foreground/30" />
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your cart is empty
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Looks like you haven't added any products to your cart yet. Browse
              our catalog to find development boards, kits, and components for
              your next build.
            </p>
            <div className="mt-7">
              <Button
                asChild
                className="h-11 rounded-full bg-blue-600 px-6 text-white border-blue-700 hover:bg-blue-700"
              >
                <Link href="/shop">
                  Continue Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero strip — matches Blog/About */}
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
          {/* Breadcrumb */}
          <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Cart</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-px w-6 bg-foreground/30" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Shopping Cart
                </span>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Your <span className="text-blue-600">cart</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} ready for
                checkout — review your selections below.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-full px-4 border-border/80"
            >
              <Link href="/shop">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Cart items */}
          <div className="min-w-0 flex-1 space-y-4">
            {/* Free-shipping nudge */}
            {freeShippingRemaining > 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    <Truck className="mr-1.5 inline-block h-4 w-4 text-blue-600" />
                    Add{" "}
                    <span className="font-semibold text-blue-600">
                      ₹{freeShippingRemaining.toLocaleString("en-IN")}
                    </span>{" "}
                    more to unlock{" "}
                    <span className="font-semibold text-foreground">
                      free shipping
                    </span>
                    .
                  </p>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {Math.round(freeShippingProgress)}% there
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                  <Truck className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">
                  You've unlocked free shipping on this order.
                </span>
              </div>
            )}

            {/* Items list */}
            <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 sm:px-7">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    Cart Items
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "product" : "products"} in your cart
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full px-3 text-xs text-muted-foreground"
                  onClick={() => cart.forEach((i) => removeFromCart(i.product.id))}
                >
                  Clear cart
                </Button>
              </div>

              <ul className="divide-y divide-border/60">
                {cart.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <li
                      key={item.product.id}
                      className="grid grid-cols-1 gap-4 px-5 py-5 sm:px-7 md:grid-cols-12 md:items-center"
                    >
                      {/* Product */}
                      <div className="flex items-start gap-4 md:col-span-6">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="block shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-2"
                        >
                          <img
                            src={getOptimizedImageUrl(item.product.images[0], { width: 200, crop: "fill" })}
                            alt={item.product.name}
                            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                            {item.product.brand}
                          </p>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="mt-0.5 block text-sm font-semibold leading-snug text-foreground transition-colors hover:text-blue-600 sm:text-base"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-[11px] font-mono text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rose-600 transition-colors hover:text-rose-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between md:col-span-2 md:flex-col md:items-center md:justify-center md:gap-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                          Price
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          ₹{item.product.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between md:col-span-2 md:justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                          Qty
                        </span>
                        <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-border/70 bg-card">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="flex h-9 min-w-10 items-center justify-center px-2 text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="flex items-center justify-between md:col-span-2 md:justify-end">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                          Total
                        </span>
                        <span className="text-base font-semibold text-foreground sm:text-lg">
                          ₹{lineTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Coupon row */}
            <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-200/60">
                  <Tag className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Have a coupon code?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apply at checkout to save on your order.
                  </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="SYNERGY5"
                    className="h-10 w-full rounded-full border-border/80 bg-background sm:w-48"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 shrink-0 rounded-full border-border/80 px-4"
                    onClick={() => {
                      if (coupon.trim()) setAppliedCoupon(coupon.trim());
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Coupon{" "}
                    <span className="font-semibold">{appliedCoupon}</span>{" "}
                    applied — 5% off saved at checkout.
                  </span>
                  <button
                    type="button"
                    className="text-emerald-700/80 underline-offset-2 hover:underline"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCoupon("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </section>

            {/* Trust strip */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Truck,
                  title: "Free shipping",
                  desc: "On orders over ₹5,000",
                },
                {
                  icon: ShieldCheck,
                  title: "Genuine products",
                  desc: "GST invoice included",
                },
                {
                  icon: Lock,
                  title: "Secure checkout",
                  desc: "SSL encrypted payment",
                },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-blue-600">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {t.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order summary */}
          <aside className="w-full shrink-0 lg:w-96">
            <div className="sticky top-6 space-y-4">
              <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700"
                />
                <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/30" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Order Summary
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    Price Details
                  </h2>

                  <dl className="mt-5 space-y-3.5 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">
                        Subtotal · {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                      </dt>
                      <dd className="font-medium text-foreground">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">GST (18%)</dt>
                      <dd className="font-medium text-foreground">
                        ₹{Math.round(gst).toLocaleString("en-IN")}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd
                        className={cn(
                          "font-medium",
                          shipping === 0 ? "text-emerald-600" : "text-foreground"
                        )}
                      >
                        {shipping === 0
                          ? "Free"
                          : `₹${shipping.toLocaleString("en-IN")}`}
                      </dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600">
                        <dt className="font-medium">
                          Coupon discount ({appliedCoupon})
                        </dt>
                        <dd className="font-semibold">
                          − ₹{discount.toLocaleString("en-IN")}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="my-5 border-t border-border/60" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Payable
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Inclusive of all taxes
                      </p>
                    </div>
                    <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      ₹{Math.round(finalTotal).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {discount > 0 && (
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
                      You saved ₹{discount.toLocaleString("en-IN")} on this order
                    </p>
                  )}

                  <div className="mt-5 flex flex-col gap-2">
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-blue-600 text-sm font-semibold text-white border-blue-700 hover:bg-blue-700"
                    >
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 w-full rounded-full border-border/80"
                    >
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Secure checkout powered by SSL encryption
                  </div>
                </div>
              </section>

              {/* Payment + accepted cards row */}
              <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-200/60">
                    <CreditCard className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    Accepted Payment Methods
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {["UPI", "Net Banking", "Cards", "Wallets", "EMI", "COD"].map(
                    (m) => (
                      <div
                        key={m}
                        className="flex items-center justify-center rounded-lg border border-border/60 bg-background px-2 py-2 text-[11px] font-medium text-foreground"
                      >
                        {m}
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-[11px] text-muted-foreground">
                  <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <p>
                    Orders ship within{" "}
                    <span className="font-semibold text-foreground">
                      24 hours
                    </span>{" "}
                    from our Coimbatore warehouse.
                  </p>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

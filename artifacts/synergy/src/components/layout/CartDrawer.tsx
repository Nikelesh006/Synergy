import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CartDrawer() {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useStore();
  const gst = cartTotal * 0.18;
  const finalTotal = cartTotal + gst;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="hidden" id="cart-drawer-trigger">Open Cart</button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <SheetTitle className="text-lg">Shopping Cart ({cartCount})</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
              <p>Your cart is empty</p>
              <SheetClose asChild>
                <Link href="/shop">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.product.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <div className="w-20 h-20 bg-gray-50 rounded border border-gray-100 p-2 flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product.name}</h4>
                    <span className="text-xs text-gray-500 font-mono mt-1">SKU: {item.product.sku}</span>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center border border-gray-300 rounded h-7">
                        <button 
                          className="px-2 text-gray-500 hover:bg-gray-100 h-full flex items-center"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        >-</button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          className="px-2 text-gray-500 hover:bg-gray-100 h-full flex items-center"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 text-gray-600">
              <span>Estimated GST (18%)</span>
              <span className="font-medium">₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
              <span>Total</span>
              <span className="text-red-600">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <SheetClose asChild>
              <Link href="/cart" className="w-full block mb-2">
                <Button variant="outline" className="w-full">View Full Cart</Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/checkout" className="w-full block">
                <Button className="w-full bg-red-600 hover:bg-red-700 font-bold flex items-center gap-2">
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

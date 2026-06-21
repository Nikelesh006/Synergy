import { Link } from "wouter";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  
  const gst = cartTotal * 0.18;
  const shipping = cartTotal > 5000 ? 0 : 250;
  const finalTotal = cartTotal + gst + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any products to your cart yet. Browse our catalog to find what you need.</p>
        <Link href="/shop">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.product.id} className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      <div className="col-span-1 md:col-span-6 flex items-start gap-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-gray-50 rounded border border-gray-100 p-2"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-semibold text-blue-600 uppercase mb-1 block">{item.product.brand}</span>
                          <Link href={`/product/${item.product.slug}`} className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1">
                            {item.product.name}
                          </Link>
                          <span className="text-xs text-gray-500 font-mono block mb-2">SKU: {item.product.sku}</span>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-red-600 flex items-center gap-1 hover:underline"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                        <span className="md:hidden text-sm text-gray-500 w-24">Price:</span>
                        <span className="font-medium text-gray-900">₹{item.product.price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                        <span className="md:hidden text-sm text-gray-500 w-24">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded h-9 w-24">
                          <button 
                            className="px-2 text-gray-500 hover:bg-gray-100 h-full w-8 flex items-center justify-center"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          >-</button>
                          <input 
                            type="text" 
                            value={item.quantity} 
                            readOnly 
                            className="w-full text-center border-0 text-sm font-medium p-0 focus:ring-0 h-full"
                          />
                          <button 
                            className="px-2 text-gray-500 hover:bg-gray-100 h-full w-8 flex items-center justify-center"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >+</button>
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 flex md:justify-end items-center">
                        <span className="md:hidden text-sm text-gray-500 w-24">Total:</span>
                        <span className="font-bold text-gray-900 text-lg">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                      
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated GST (18%)</span>
                  <span className="font-medium text-gray-900">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
              
              <Separator className="mb-4" />
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-base font-bold text-gray-900">Total Order Amount</span>
                <span className="text-2xl font-extrabold text-red-600">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              
              <Link href="/checkout" className="block w-full">
                <Button className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="mt-4 text-center">
                <Link href="/shop" className="text-sm font-medium text-blue-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

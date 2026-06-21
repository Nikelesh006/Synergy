import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Checkout() {
  const { cartTotal } = useStore();
  const [step, setStep] = useState(1);
  const gst = cartTotal * 0.18;
  const shipping = cartTotal > 5000 ? 0 : 250;
  const total = cartTotal + gst + shipping;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Steps Indicator */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="font-medium hidden sm:block">Address</span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="font-medium hidden sm:block">Payment</span>
              </div>
              <div className={`flex-1 h-1 mx-4 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="font-medium hidden sm:block">Confirm</span>
              </div>
            </div>

            {/* Forms */}
            {step === 1 && (
              <form onSubmit={handleNext} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input required placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input required placeholder="Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input required type="tel" placeholder="+91" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input required type="email" placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Input required placeholder="Street address, building, company, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input required placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <Input required placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <Input required placeholder="000000" />
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gst" />
                    <label htmlFor="gst" className="text-sm font-medium text-gray-700">Claim GST Input Tax Credit</label>
                  </div>
                  <div className="mt-4 pl-6">
                    <Input placeholder="Enter GSTIN" className="bg-white" />
                    <Input placeholder="Company Name" className="bg-white mt-2" />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold">
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-8">
                  <label className="flex items-center justify-between p-4 border border-blue-600 rounded-lg bg-blue-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="h-4 w-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="font-medium text-gray-900">UPI / QR Code</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <span className="font-medium text-gray-900">Credit / Debit Card</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <span className="font-medium text-gray-900">Net Banking</span>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 w-full md:w-auto px-8">Back</Button>
                  <Button type="submit" className="w-full flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold">
                    Review Order
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-8">Thank you for your purchase. Your order ID is SYN-12345.</p>
                <Link href="/track-order">
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 h-12 px-8 font-bold">
                    Track Order
                  </Button>
                </Link>
              </div>
            )}
          </div>

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
              
              <div className="flex justify-between items-end mb-4">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-red-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

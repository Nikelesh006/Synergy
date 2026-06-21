import { Link } from "wouter";
import { Package, Truck, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function TrackOrder() {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Track Order</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID and email to get the latest delivery status.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <Input type="text" placeholder="e.g. SYN-12345" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
              <Input type="text" placeholder="Enter email or phone number" required />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full md:w-auto h-10 px-8 bg-blue-600 hover:bg-blue-700">
                Track
              </Button>
            </div>
          </form>
        </div>

        {isTracking && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-6 bg-slate-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Order #SYN-12345</h2>
                  <p className="text-sm text-gray-500">Placed on Oct 24, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">Estimated Delivery</p>
                  <p className="font-bold text-gray-900">Oct 28, 2024</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-8 relative">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Order Confirmed</h3>
                      <p className="text-sm text-gray-500">Your order has been verified and confirmed.</p>
                      <p className="text-xs text-gray-400 mt-1">Oct 24, 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Packed</h3>
                      <p className="text-sm text-gray-500">Your items are packed and ready for dispatch.</p>
                      <p className="text-xs text-gray-400 mt-1">Oct 25, 02:15 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">In Transit</h3>
                      <p className="text-sm text-gray-500">Your order is on the way to the destination hub.</p>
                      <p className="text-xs text-gray-400 mt-1">Oct 26, 08:45 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-6 opacity-50">
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Out for Delivery</h3>
                      <p className="text-sm text-gray-500">Pending</p>
                    </div>
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

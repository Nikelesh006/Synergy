import { User, Package, MapPin, CreditCard, LogOut, Settings, Bell } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  JD
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">John Doe</h3>
                  <p className="text-xs text-gray-500">Acme Contractors</p>
                </div>
              </div>
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link href="/account" className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-700 font-medium border-r-4 border-blue-600">
                    <User className="h-4 w-4" /> Profile Details
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <Package className="h-4 w-4 text-gray-400" /> My Orders
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <MapPin className="h-4 w-4 text-gray-400" /> Addresses
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <CreditCard className="h-4 w-4 text-gray-400" /> GST & Billing
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4 text-gray-400" /> Settings
                  </Link>
                </li>
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-red-600">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <div className="font-medium text-gray-900">John Doe</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <div className="font-medium text-gray-900">john.doe@acmecontractors.com</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <div className="font-medium text-gray-900">+91 98765 43210</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                  <div className="font-medium text-gray-900">Acme Contractors Pvt. Ltd.</div>
                </div>
              </div>
              <Button variant="outline" className="mt-6">Edit Profile</Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 bg-gray-50 uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">SYN-12345</td>
                      <td className="px-4 py-4 text-gray-600">Oct 24, 2024</td>
                      <td className="px-4 py-4 text-gray-900 font-medium">₹12,450</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          In Transit
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href="/track-order" className="text-blue-600 hover:underline font-medium">Track</Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">SYN-12100</td>
                      <td className="px-4 py-4 text-gray-600">Sep 15, 2024</td>
                      <td className="px-4 py-4 text-gray-900 font-medium">₹45,800</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href="/account" className="text-blue-600 hover:underline font-medium">Invoice</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

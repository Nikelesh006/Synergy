import { Link } from "wouter";
import { Zap, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-red-600 text-white p-1 rounded-sm">
                <Zap className="h-6 w-6 fill-current" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">SYNERGY</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              India's premier electrical hardware supply platform for contractors, electricians, builders, and institutions. Genuine products, GST billing, and bulk pricing.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                <span>123 Industrial Area, Phase 1, New Delhi, 110020, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500 shrink-0" />
                <span>1800 123 4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500 shrink-0" />
                <span>sales@synergy-electrical.in</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/category/circuit-protection" className="hover:text-blue-400 transition-colors">Circuit Protection</Link></li>
              <li><Link href="/category/wires-cables" className="hover:text-blue-400 transition-colors">Wires & Cables</Link></li>
              <li><Link href="/category/switches-sockets" className="hover:text-blue-400 transition-colors">Switches & Sockets</Link></li>
              <li><Link href="/category/industrial-controls" className="hover:text-blue-400 transition-colors">Industrial Controls</Link></li>
              <li><Link href="/category/lighting" className="hover:text-blue-400 transition-colors">Lighting Solutions</Link></li>
              <li><Link href="/category/safety-products" className="hover:text-blue-400 transition-colors">Safety Gear</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/bulk-enquiry" className="hover:text-blue-400 transition-colors">Bulk Order Enquiry</Link></li>
              <li><Link href="/track-order" className="hover:text-blue-400 transition-colors">Track Your Order</Link></li>
              <li><Link href="/brands" className="hover:text-blue-400 transition-colors">Shop by Brand</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Knowledge Center</Link></li>
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Policies</h3>
            <ul className="space-y-3 text-sm mb-8">
              <li><Link href="/policies/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-blue-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/refund" className="hover:text-blue-400 transition-colors">Return & Refund Policy</Link></li>
            </ul>
            
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Synergy Electrical Solutions Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono">GSTIN: 07AABCU9603R1ZX</span>
            <div className="flex gap-2">
              <img src="https://placehold.co/40x25/222/666?text=Visa" alt="Visa" className="rounded" />
              <img src="https://placehold.co/40x25/222/666?text=MC" alt="Mastercard" className="rounded" />
              <img src="https://placehold.co/40x25/222/666?text=UPI" alt="UPI" className="rounded" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

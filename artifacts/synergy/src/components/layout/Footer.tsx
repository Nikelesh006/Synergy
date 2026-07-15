import { Link } from "wouter";
import { Cpu, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">

          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-4 sm:mb-6">
              <img src="/synergy-logo-footer.png" alt="Synergy Tech Labs" draggable={false} onDragStart={(e) => e.preventDefault()} className="h-12 sm:h-14 md:h-16 w-auto select-none" />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 max-w-sm leading-relaxed">
              Innovation-driven technology company specializing in Embedded Systems, IoT, Edge AI, Robotics, and Industrial Automation solutions.
            </p>
            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 shrink-0 mt-0.5" />
                <span>No 24, S.V.L. Nagar,Sulur, Coimbatore -641402</span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 shrink-0" />
                <span>+91 98425 84477</span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 shrink-0" />
                <span>sales@synergytechlabs.in</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-6 uppercase tracking-wider text-[11px] sm:text-sm">Solutions</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><Link href="/services#embedded" className="hover:text-blue-400 transition-colors">Embedded Systems</Link></li>
              <li><Link href="/services#iot" className="hover:text-blue-400 transition-colors">IoT & Cloud Integration</Link></li>
              <li><Link href="/services#edge-ai" className="hover:text-blue-400 transition-colors">Edge AI Analytics</Link></li>
              <li><Link href="/services#robotics" className="hover:text-blue-400 transition-colors">Robotics</Link></li>
              <li><Link href="/services#training" className="hover:text-blue-400 transition-colors">Skill Development</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-6 uppercase tracking-wider text-[11px] sm:text-sm">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/bulk-enquiry" className="hover:text-blue-400 transition-colors">Bulk Order Enquiry</Link></li>
              <li><Link href="/track-order" className="hover:text-blue-400 transition-colors">Track Your Order</Link></li>
              <li><Link href="/blogs" className="hover:text-blue-400 transition-colors">Blogs</Link></li>
              <li><Link href="/about#contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-6 uppercase tracking-wider text-[11px] sm:text-sm">Policies</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-4 sm:mb-8">
              <li><Link href="/policies/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-blue-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/refund" className="hover:text-blue-400 transition-colors">Return & Refund Policy</Link></li>
            </ul>

            <h3 className="text-white font-semibold mb-3 sm:mb-4 uppercase tracking-wider text-[11px] sm:text-sm">Connect With Us</h3>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="bg-slate-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>
              <a href="#" className="bg-slate-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-400 hover:text-white transition-colors"><Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>
              <a href="#" className="bg-slate-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-700 hover:text-white transition-colors"><Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>
              <a href="#" className="bg-slate-800 p-1.5 sm:p-2 rounded-full hover:bg-pink-600 hover:text-white transition-colors"><Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Synergy Tech Labs. All rights reserved.</p>
          <p className="text-center font-semibold text-xs sm:text-sm">Powered by <a href="https://www.codecraftnet.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors font-bold">Code Craft</a></p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-mono text-[10px] sm:text-xs">GSTIN: 07AABCU9603R1ZX</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <img src="/visa.svg" alt="Visa" className="h-6 w-10 sm:h-7 sm:w-12 object-contain bg-white rounded p-0.5 sm:p-1" draggable={false} />
              <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-10 sm:h-7 sm:w-12 object-contain bg-white rounded p-0.5 sm:p-1" draggable={false} />
              <img src="/rupay.png" alt="RuPay" className="h-6 w-10 sm:h-7 sm:w-12 object-contain bg-white rounded p-0" draggable={false} />
              <img src="/upi.svg" alt="UPI" className="h-6 w-10 sm:h-7 sm:w-12 object-contain bg-white rounded p-0.5 sm:p-1" draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

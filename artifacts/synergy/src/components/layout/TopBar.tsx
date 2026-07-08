import { Phone, Mail, Package, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 hidden md:block">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>123456789</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span>sales@synergy.in</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/bulk-enquiry" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
            <Package className="h-3 w-3" />
            <span>Bulk Orders & GST</span>
          </Link>
          <Link href="/track-order" className="flex items-center gap-2 hover:text-blue-300 transition-colors">
            <MapPin className="h-3 w-3" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

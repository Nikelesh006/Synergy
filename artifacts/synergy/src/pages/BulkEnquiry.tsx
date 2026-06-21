import { Building2, FileText, BadgePercent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BulkEnquiry() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Bulk Orders & Project Supplies</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Dedicated support, custom pricing, and GST invoices for contractors, builders, and corporate institutions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Enquiry Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <Input placeholder="Enter your company name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                    <Input placeholder="Enter full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <Input type="email" placeholder="work@company.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <Input type="tel" placeholder="+91" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                    <Input placeholder="Optional" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <select className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 p-2 border">
                      <option>Residential Construction</option>
                      <option>Commercial Building</option>
                      <option>Industrial Plant</option>
                      <option>Maintenance / Repair</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload BOM (Bill of Materials)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drag & drop your Excel/PDF file here, or click to browse</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements / Message</label>
                  <textarea 
                    className="w-full border-gray-300 rounded-md p-3 text-sm focus:ring-blue-500 focus:border-blue-500 border min-h-[120px]" 
                    placeholder="Tell us more about your project needs..."
                  ></textarea>
                </div>

                <Button type="submit" className="w-full md:w-auto px-8 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg">
                  Submit Enquiry
                </Button>
              </form>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Partner With Synergy?</h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex gap-4">
              <BadgePercent className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Volume Pricing</h4>
                <p className="text-sm text-gray-600 mt-1">Get special discounts on large quantities. The more you buy, the more you save.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex gap-4">
              <Building2 className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">GST Input Credit</h4>
                <p className="text-sm text-gray-600 mt-1">100% tax compliant GST invoices to help you claim input tax credit.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex gap-4">
              <Clock className="h-8 w-8 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900">Priority Dispatch</h4>
                <p className="text-sm text-gray-600 mt-1">Dedicated logistics for project supplies to ensure your work never stops.</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-8">
              <h4 className="font-bold text-gray-900 mb-2">Need immediate assistance?</h4>
              <p className="text-sm text-gray-700 mb-4">Our B2B specialists are available to take your call.</p>
              <div className="text-xl font-bold text-blue-700">1800-123-B2B (222)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

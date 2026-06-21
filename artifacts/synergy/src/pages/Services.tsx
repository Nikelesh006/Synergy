import { Wrench, PackageCheck, FileSpreadsheet, HardHat } from "lucide-react";

export default function Services() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Beyond supplying hardware, Synergy offers value-added services to make your electrical projects seamless.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Wrench className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Panel Assembly Support</h2>
            <p className="text-gray-600 leading-relaxed">
              We assist panel builders by sourcing all necessary components—from switchgear to lugs and wires—matching exact specifications to streamline your assembly process.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6">
              <PackageCheck className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Project Supply Management</h2>
            <p className="text-gray-600 leading-relaxed">
              For large construction projects, we offer staggered delivery schedules. Get your conduits in month one, wires in month two, and switches at finishing to optimize your cash flow and storage.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6">
              <FileSpreadsheet className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Custom BOM Quotation</h2>
            <p className="text-gray-600 leading-relaxed">
              Upload your Bill of Materials and our technical team will cross-reference it with our catalog, suggesting equivalent alternatives if items are out of stock, providing a comprehensive quote.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-6">
              <HardHat className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contractor Support</h2>
            <p className="text-gray-600 leading-relaxed">
              Dedicated account managers for regular contractors. Enjoy priority sourcing, credit terms (subject to approval), and easy re-ordering of your standard requirements.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

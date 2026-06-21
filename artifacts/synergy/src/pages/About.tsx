import { Link } from "wouter";
import { ShieldCheck, Truck, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powering India's Infrastructure</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Synergy is the trusted electrical hardware partner for contractors, builders, and industries across the nation.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">10,000+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">500+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Brands</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">50,000+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Orders Delivered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">15</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-700">
            <p>Founded in 2009, Synergy began with a simple mission: to organize the fragmented electrical supply market and provide contractors with a reliable, single-source destination for genuine products.</p>
            <p>We realized that procurement professionals were spending too much time negotiating with multiple vendors, managing logistics, and worrying about counterfeit products. Synergy was built to solve these exact problems.</p>
            <p>Today, we operate a centralized fulfillment center that serves thousands of pin codes across India, ensuring that whether you are wiring a residential complex or setting up an industrial control panel, you get the right parts, at the right price, exactly when you need them.</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Synergy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Genuine</h3>
              <p className="text-gray-600 text-sm">We source directly from manufacturers or authorized distributors. No counterfeits, ever.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pan-India Logistics</h3>
              <p className="text-gray-600 text-sm">Robust supply chain ensuring timely delivery to remote project sites across the country.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-gray-600 text-sm">Our team of engineers helps you select the correct specifications for your application.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">GST Compliant</h3>
              <p className="text-gray-600 text-sm">Transparent B2B billing allowing you to claim input tax credit effortlessly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

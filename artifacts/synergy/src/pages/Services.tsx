import { Wrench, PackageCheck, FileSpreadsheet, HardHat } from "lucide-react";

export default function Services() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Synergy Tech Labs delivers customized solutions spanning product development, system integration, and technology education.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
              <Wrench className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Product Development & System Integration</h2>
            <p className="text-gray-600 leading-relaxed">
              We specialize in transforming ideas into reliable, scalable products. Our expertise covers hardware design, firmware development, and end-to-end system integration for industrial and research applications.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-6">
              <PackageCheck className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">IoT & Cloud Integration</h2>
            <p className="text-gray-600 leading-relaxed">
              We develop smart, connected systems by integrating wireless communication with robust cloud platforms, enabling seamless data collection and operational efficiency for your business.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6">
              <FileSpreadsheet className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Edge AI & Intelligent Analytics</h2>
            <p className="text-gray-600 leading-relaxed">
              Leveraging advanced algorithms, we build Edge AI solutions that process data locally for real-time, predictive decision-making without relying solely on cloud connectivity.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-8 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-6">
              <HardHat className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Technology Education & Training</h2>
            <p className="text-gray-600 leading-relaxed">
              We conduct hands-on training programs, workshops, and skill development initiatives in Embedded Systems, IoT, Robotics, and AI, collaborating with academic institutions to bridge the gap between emerging tech and real-world skills.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

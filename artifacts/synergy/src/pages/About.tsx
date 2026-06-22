import { Link } from "wouter";
import { ShieldCheck, Truck, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-slate-900 py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Innovation-Driven Technology</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Synergy Tech Labs specializes in Embedded Systems, Internet of Things (IoT), Edge Artificial Intelligence (Edge AI), Robotics, and Industrial Automation solutions.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">50+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Industrial Projects</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">100+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Workshops Conducted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">5,000+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Students Trained</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black mb-1">10+</div>
              <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg text-gray-700">
            <p>Synergy Tech Labs is an innovation-driven technology company committed to transforming innovative ideas into reliable, scalable, and industry-ready products through cutting-edge research, design, and development.</p>
            <p>With expertise spanning hardware design, firmware development, wireless communication, cloud integration, and intelligent analytics, we deliver customized solutions for industrial, educational, and research applications. We focus on developing smart systems that enhance operational efficiency, enable predictive decision-making, and support digital transformation initiatives.</p>
            <p>In addition to product development and system integration, we actively promote technology education by conducting hands-on training programs, workshops, and skill development initiatives. We collaborate with academic institutions, industries, and research organizations to bridge the gap between emerging technologies and real-world applications.</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Synergy Tech Labs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Industry 4.0 Focus</h3>
              <p className="text-gray-600 text-sm">Delivering next-generation smart solutions driven by innovation and predictive analytics.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customized Solutions</h3>
              <p className="text-gray-600 text-sm">Tailored implementations for industrial, educational, and complex research applications.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Skill Development</h3>
              <p className="text-gray-600 text-sm">Hands-on training programs and workshops in Embedded Systems, IoT, Robotics, and AI.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Proven Excellence</h3>
              <p className="text-gray-600 text-sm">A trusted technology partner prioritizing quality, customer satisfaction, and real-world results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

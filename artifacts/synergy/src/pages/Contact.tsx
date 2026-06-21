import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600">Have a question about a product, your order, or need technical support? We're here to help.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm">
              <MapPin className="h-6 w-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Corporate Office</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  123 Industrial Area, Phase 1<br />
                  Okhla Industrial Estate<br />
                  New Delhi, 110020, India
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm">
              <Phone className="h-6 w-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-sm text-gray-600 mb-2">Toll Free: 1800 123 4567</p>
                <p className="text-sm text-gray-600">B2B Support: +91 98765 43210</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm">
              <Mail className="h-6 w-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-sm text-gray-600 mb-1">Support: support@synergy-electrical.in</p>
                <p className="text-sm text-gray-600">Sales: sales@synergy-electrical.in</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 shadow-sm">
              <Clock className="h-6 w-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
                <p className="text-sm text-gray-600">Monday - Saturday: 9:00 AM to 7:00 PM</p>
                <p className="text-sm text-gray-600 mt-1 text-red-600 font-medium">Sunday Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option>Order Inquiry</option>
                    <option>Product Information</option>
                    <option>Technical Support</option>
                    <option>Returns/Refunds</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

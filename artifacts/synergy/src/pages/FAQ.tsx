import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FAQ() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mb-8">Find answers to common questions about our products, shipping, and B2B services.</p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white" placeholder="Search FAQs..." />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Orders & Shipping</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold text-gray-800">What are your shipping charges?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We offer free shipping on all orders above ₹5,000. For orders below this amount, a standard shipping fee of ₹250 applies. Bulk project deliveries may have custom freight charges based on weight and distance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold text-gray-800">How long does delivery take?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Standard items are dispatched within 24-48 hours. Delivery typically takes 3-5 business days to metro cities and 5-7 days to other locations. Specialized or out-of-stock items will have lead times mentioned on their product pages.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold text-gray-800">Do you deliver to construction sites?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we regularly deliver to project sites. Please ensure clear address details and site contact person information is provided during checkout or bulk order placement.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">B2B & Bulk Orders</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold text-gray-800">Do you provide GST invoices?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, 100%. All our products are billed with valid GST invoices. You can enter your company's GSTIN during checkout or in your account profile to claim Input Tax Credit (ITC).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-semibold text-gray-800">How do I get a quote for my project BOM?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You can visit our Bulk Enquiry page to upload your Bill of Materials (Excel/PDF). Our technical sales team will review it and provide a customized quotation with volume discounts within 24 hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Products & Warranty</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-semibold text-gray-800">Are your products genuine?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Absolutely. Synergy is an authorized partner/distributor for major brands like Havells, Legrand, Schneider Electric, and Polycab. All products are 100% genuine and come in original manufacturer packaging.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-semibold text-gray-800">How do I claim a warranty?</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Warranty is provided directly by the manufacturer. You can visit the respective brand's authorized service center with the Synergy GST invoice. If you face issues, our support team can help connect you with the right brand representative.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqItem = { id: string; question: string; answer: string };
type FaqCategory = { title: string; items: FaqItem[] };

const faqData: FaqCategory[] = [
  {
    title: "Orders & Shipping",
    items: [
      {
        id: "shipping-charges",
        question: "What are your shipping charges?",
        answer:
          "We offer free shipping on all orders above ₹5,000. For orders below this amount, a standard shipping fee of ₹250 applies. Bulk project deliveries may have custom freight charges based on weight and distance.",
      },
      {
        id: "delivery-time",
        question: "How long does delivery take?",
        answer:
          "Standard items are dispatched within 24-48 hours. Delivery typically takes 3-5 business days to metro cities and 5-7 days to other locations. Specialized or out-of-stock items will have lead times mentioned on their product pages.",
      },
      {
        id: "site-delivery",
        question: "Do you deliver to construction sites?",
        answer:
          "Yes, we regularly deliver to project sites. Please ensure clear address details and site contact person information is provided during checkout or bulk order placement.",
      },
    ],
  },
  {
    title: "B2B & Bulk Orders",
    items: [
      {
        id: "gst-invoice",
        question: "Do you provide GST invoices?",
        answer:
          "Yes, 100%. All our products are billed with valid GST invoices. You can enter your company's GSTIN during checkout or in your account profile to claim Input Tax Credit (ITC).",
      },
      {
        id: "project-quote",
        question: "How do I get a quote for my project BOM?",
        answer:
          "You can visit our Bulk Enquiry page to upload your Bill of Materials (Excel/PDF). Our technical sales team will review it and provide a customized quotation with volume discounts within 24 hours.",
      },
    ],
  },
  {
    title: "Products & Warranty",
    items: [
      {
        id: "genuine-products",
        question: "Are your products genuine?",
        answer:
          "Absolutely. Synergy is an authorized partner/distributor for major brands like Havells, Legrand, Schneider Electric, and Polycab. All products are 100% genuine and come in original manufacturer packaging.",
      },
      {
        id: "warranty-claim",
        question: "How do I claim a warranty?",
        answer:
          "Warranty is provided directly by the manufacturer. You can visit the respective brand's authorized service center with the Synergy GST invoice. If you face issues, our support team can help connect you with the right brand representative.",
      },
    ],
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | undefined>("shipping-charges");

  return (
    <div className="bg-background min-h-screen">
      <section className="container mx-auto max-w-3xl px-4 py-20 md:py-28">
        <div className="mb-24 text-center md:mb-32">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-foreground/30" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Help Center
            </span>
            <span className="h-px w-8 bg-foreground/30" />
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Frequently Asked{" "}
            <span className="text-blue-600">Questions</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Find quick answers about products, shipping, and B2B services.
          </p>
        </div>

        <div className="space-y-10">
          {faqData.map((cat) => (
            <div key={cat.title}>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-6 bg-foreground/30" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {cat.title}
                </span>
              </div>
              <div className="space-y-3">
                {cat.items.map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300",
                        isOpen
                          ? "border-blue-600/40 shadow-md ring-1 ring-blue-600/10"
                          : "hover:border-foreground/20 hover:shadow-md",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(isOpen ? undefined : item.id)
                        }
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
                      >
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors sm:text-base",
                            isOpen ? "text-blue-600" : "text-foreground",
                          )}
                        >
                          {item.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                            isOpen
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-border/70 bg-background text-foreground/70",
                          )}
                        >
                          <ChevronDown
                            className="h-4 w-4"
                            strokeWidth={2.25}
                          />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                              opacity: { duration: 0.25, ease: "easeOut" },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border/60 px-6 py-5 text-sm leading-relaxed text-muted-foreground sm:px-7">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Link } from "wouter";
import {
  ShieldCheck,
  Truck,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const stats = [
  { value: "50+", label: "Industrial Projects" },
  { value: "100+", label: "Workshops Conducted" },
  { value: "5,000+", label: "Students Trained" },
  { value: "10+", label: "Years Experience" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Industry 4.0 Focus",
    description:
      "Delivering next-generation smart solutions driven by innovation and predictive analytics.",
    accent: "text-blue-600",
  },
  {
    icon: Truck,
    title: "Customized Solutions",
    description:
      "Tailored implementations for industrial, educational, and complex research applications.",
    accent: "text-rose-600",
  },
  {
    icon: Users,
    title: "Skill Development",
    description:
      "Hands-on training programs and workshops in Embedded Systems, IoT, Robotics, and AI.",
    accent: "text-emerald-600",
  },
  {
    icon: Award,
    title: "Proven Excellence",
    description:
      "A trusted technology partner prioritizing quality, customer satisfaction, and real-world results.",
    accent: "text-amber-600",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    title: "Corporate Office",
    lines: [
      "No 24, S.V.L. Nagar, Sulur",
      "Coimbatore - 641402",
      "Tamil Nadu, India",
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["Toll Free: 1800 123 4567", "B2B Support: +91 98765 43210"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: [
      "Support: support@synergytechlabs.in",
      "Sales: sales@synergytechlabs.in",
    ],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday - Saturday: 9:00 AM to 7:00 PM", "Sunday Closed"],
    highlight: "Sunday Closed",
  },
];

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero — kept as the original dark header design */}
      <div className="bg-slate-900 py-20 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Innovation-Driven Technology
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Synergy Tech Labs specializes in Embedded Systems, Internet of
            Things (IoT), Edge Artificial Intelligence (Edge AI), Robotics, and
            Industrial Automation solutions.
          </p>
        </div>
      </div>

      {/* Stats Strip — premium glass-style */}
      <section className="border-b border-border/60 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/70 bg-card px-6 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Story */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Text */}
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-foreground/30" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Our Mission
              </span>
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              Our Mission
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                Synergy Tech Labs is an innovation-driven technology company
                committed to transforming innovative ideas into reliable,
                scalable, and industry-ready products through cutting-edge
                research, design, and development.
              </p>
              <p>
                With expertise spanning hardware design, firmware development,
                wireless communication, cloud integration, and intelligent
                analytics, we deliver customized solutions for industrial,
                educational, and research applications. We focus on developing
                smart systems that enhance operational efficiency, enable
                predictive decision-making, and support digital transformation
                initiatives.
              </p>
              <p>
                In addition to product development and system integration, we
                actively promote technology education by conducting hands-on
                training programs, workshops, and skill development initiatives.
                We collaborate with academic institutions, industries, and
                research organizations to bridge the gap between emerging
                technologies and real-world applications.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(50% 50% at 0% 0%, hsl(var(--primary) / 0.08), transparent 60%), radial-gradient(50% 50% at 100% 100%, hsl(var(--primary) / 0.06), transparent 60%)",
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                alt="Embedded systems and circuit board technology"
                loading="lazy"
                className="relative h-72 w-full object-cover sm:h-80 lg:h-[28rem]"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Engineering reliable, scalable, and industry-ready products.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border/60 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-foreground/30" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Why Us
              </span>
              <span className="h-px w-8 bg-foreground/30" />
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              Why Choose Synergy Tech Labs
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg"
                >
                  <div
                    className={cn(
                      "mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-muted",
                      value.accent
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative overflow-hidden border-y border-border/60 bg-gradient-to-br from-muted/40 via-background to-muted/20 py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(40% 40% at 0% 0%, hsl(var(--primary) / 0.10), transparent 60%), radial-gradient(40% 40% at 100% 100%, hsl(var(--primary) / 0.08), transparent 60%)",
          }}
        />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-foreground/30" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Get in Touch
              </span>
              <span className="h-px w-8 bg-foreground/30" />
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              Contact Us
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Have a question about a product, your order, or need technical
              support? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Contact Form — pale background card (left) */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-slate-50 p-6 shadow-sm sm:p-8">
                <div className="relative">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Send us a message
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill out the form and our team will get back to you
                    shortly.
                  </p>

                  <form className="mt-7 space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          First Name
                        </label>
                        <Input
                          placeholder="Enter your first name"
                          className="h-11 rounded-xl border-border/80 bg-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Last Name
                        </label>
                        <Input
                          placeholder="Enter your last name"
                          className="h-11 rounded-xl border-border/80 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-11 rounded-xl border-border/80 bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subject
                      </label>
                      <select className="h-11 w-full rounded-xl border border-border/80 bg-white px-3 text-sm text-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20">
                        <option>Product Development Inquiry</option>
                        <option>IoT & Automation Solutions</option>
                        <option>Training & Workshops</option>
                        <option>Technical Support</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Message
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-border/80 bg-white p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20 min-h-[150px]"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div className="flex justify-end border-t border-border/60 pt-5">
                      <Button
                        type="submit"
                        className="h-11 rounded-full bg-blue-600 px-6 text-white border-blue-700 hover:bg-blue-700"
                      >
                        Send Message
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Details — unified single card (right) */}
            <div className="lg:col-span-5">
              <div className="relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-blue-600/5 blur-3xl"
                />
                <div className="relative flex h-full flex-col">
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-2">
                    <span className="h-px w-6 bg-foreground/30" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Reach Us
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    Contact details
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Reach the right team directly — sales, support, or
                    training.
                  </p>

                  {/* Unified list */}
                  <ul className="mt-6 divide-y divide-border/60">
                    {contactInfo.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li
                          key={item.title}
                          className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-blue-600 ring-1 ring-border/60 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                            <Icon className="h-5 w-5" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold tracking-tight text-foreground">
                              {item.title}
                            </h4>
                            <div className="mt-1 space-y-0.5 text-sm leading-relaxed text-muted-foreground">
                              {item.lines.map((line, i) => (
                                <p
                                  key={i}
                                  className={cn(
                                    item.highlight && line === item.highlight
                                      ? "font-medium text-rose-600"
                                      : ""
                                  )}
                                >
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer note */}
                  <div className="mt-6 flex items-center gap-2 border-t border-border/60 pt-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Talk to the engineers building our embedded, IoT, and
                      AI platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

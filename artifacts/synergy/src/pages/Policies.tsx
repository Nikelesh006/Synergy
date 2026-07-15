import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

type PolicyKey = "privacy" | "terms" | "shipping" | "refund";

const LAST_UPDATED = "July 15, 2026";

function Terms() {
  return (
    <div className="prose max-w-none text-gray-700">
      <p>Last Updated: {LAST_UPDATED}</p>

      <p>
        Welcome to Synergy Tech Labs. By accessing or using our website
        (www.synergytechlabs.in), mobile experience, or any related services
        (collectively, the "Platform"), you agree to be bound by these Terms &
        Conditions ("Terms"). Please read them carefully before placing an
        order or using any feature of the Platform.
      </p>

      <h3>1. Eligibility</h3>
      <p>
        You must be at least 18 years of age and competent to enter into a
        binding contract under the Indian Contract Act, 1872, to use this
        Platform or place an order. By using the Platform, you represent that
        you meet these requirements.
      </p>

      <h3>2. Account Registration</h3>
      <p>
        To access certain features such as order tracking, wishlists, and
        faster checkout, you may be required to create an account. You are
        responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account.
        Synergy Tech Labs will not be liable for any loss arising from
        unauthorized use of your account.
      </p>

      <h3>3. Products, Pricing & Availability</h3>
      <p>
        All product listings, descriptions, images, and prices are provided in
        good faith. We reserve the right to:
      </p>
      <ul>
        <li>Correct pricing or typographical errors at any time.</li>
        <li>Limit the quantity of any product available for purchase.</li>
        <li>
          Discontinue or update any product without prior notice.
        </li>
        <li>
          Cancel orders that appear to be placed by dealers, resellers, or
          distributors in violation of our bulk-order policy.
        </li>
      </ul>
      <p>
        Prices are listed in Indian Rupees (INR) and are inclusive of GST
        unless stated otherwise. Shipping charges, if any, are calculated and
        displayed at checkout.
      </p>

      <h3>4. Orders & Acceptance</h3>
      <p>
        Your order constitutes an offer to purchase a product. All orders are
        subject to acceptance and availability. We may, at our sole
        discretion, refuse or cancel any order, including but not limited to
        cases of suspected fraud, incorrect pricing, or stock unavailability.
        In such cases, any payment received will be fully refunded.
      </p>

      <h3>5. Payment</h3>
      <p>
        We support secure payments through UPI, credit/debit cards, net
        banking, and approved wallets. All transactions are encrypted and
        processed via PCI-DSS compliant payment partners. Synergy Tech Labs
        does not store your card or banking credentials on our servers.
      </p>

      <h3>6. Intellectual Property</h3>
      <p>
        All content on the Platform — including but not limited to text,
        graphics, logos, product images, schematics, datasheets, and software
        — is the property of Synergy Tech Labs or its licensors and is
        protected under applicable intellectual property laws. You may not
        reproduce, distribute, modify, or create derivative works without
        prior written consent.
      </p>

      <h3>7. User Conduct</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li>
        <li>Upload or transmit viruses, malware, or any code of a destructive nature.</li>
        <li>Attempt to gain unauthorised access to any portion of the Platform.</li>
        <li>Misuse reviews, ratings, or community features to defame or harass any party.</li>
      </ul>

      <h3>8. Limitation of Liability</h3>
      <p>
        To the maximum extent permitted by law, Synergy Tech Labs shall not be
        liable for any indirect, incidental, special, consequential, or
        punitive damages, including loss of profits, data, or goodwill,
        arising out of or in connection with your use of the Platform.
      </p>

      <h3>9. Governing Law & Jurisdiction</h3>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of India. Any disputes arising under or in connection with these
        Terms shall be subject to the exclusive jurisdiction of the competent
        courts in Coimbatore, Tamil Nadu.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        For questions about these Terms, please write to{" "}
        <a href="mailto:legal@synergytechlabs.in" className="text-blue-600 hover:underline">
          legal@synergytechlabs.in
        </a>
        .
      </p>
    </div>
  );
}

function Privacy() {
  return (
    <div className="prose max-w-none text-gray-700">
      <p>Last Updated: {LAST_UPDATED}</p>

      <p>
        At Synergy Tech Labs, we are committed to protecting your privacy and
        handling your personal data with transparency. This Privacy Policy
        explains what information we collect, how we use it, and the rights
        you have under the Digital Personal Data Protection Act, 2023 and
        other applicable laws.
      </p>

      <h3>1. Information We Collect</h3>
      <p>We collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account Information:</strong> name, email address, phone
          number, billing/shipping address, and password (stored in hashed
          form).
        </li>
        <li>
          <strong>Order Information:</strong> products purchased, transaction
          amounts, payment method references, GSTIN (where provided for
          business buyers), and order notes.
        </li>
        <li>
          <strong>Device & Usage Information:</strong> IP address, browser
          type, operating system, pages visited, referrer URLs, and
          approximate location derived from your IP.
        </li>
        <li>
          <strong>Communications:</strong> any messages, attachments, or
          feedback you send us through contact forms, support emails, or
          bulk-enquiry submissions.
        </li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>We process your personal data for the following purposes:</p>
      <ul>
        <li>To fulfil and deliver your orders, including shipping and returns.</li>
        <li>To verify your identity and prevent fraudulent transactions.</li>
        <li>To send you order updates, invoices, and customer support messages.</li>
        <li>
          To improve our Platform, products, and customer experience through
          aggregated analytics.
        </li>
        <li>
          To send you marketing communications about new products,
          promotions, and industry updates — only where you have opted in or
          where permitted by law. You may opt out at any time.
        </li>
        <li>To comply with our legal, tax, and regulatory obligations.</li>
      </ul>

      <h3>3. Cookies & Similar Technologies</h3>
      <p>
        We use cookies, local storage, and similar technologies to keep you
        signed in, remember items in your cart, and measure site traffic.
        You can manage cookie preferences through your browser settings. For
        details, see our Cookie Notice.
      </p>

      <h3>4. Sharing of Information</h3>
      <p>
        We do not sell your personal data. We share information only with:
      </p>
      <ul>
        <li>
          <strong>Logistics partners</strong> (e.g. BlueDart, Delhivery,
          India Post) to deliver your orders.
        </li>
        <li>
          <strong>Payment processors</strong> to securely handle transactions.
        </li>
        <li>
          <strong>Service providers</strong> who help us operate the
          Platform, such as cloud hosting, email delivery, and analytics —
          all bound by confidentiality and data-processing obligations.
        </li>
        <li>
          <strong>Government authorities</strong> when required by law or to
          protect our legal rights.
        </li>
      </ul>

      <h3>5. Data Retention</h3>
      <p>
        We retain personal data only for as long as necessary to fulfil the
        purposes for which it was collected, including to satisfy legal,
        accounting, or reporting requirements. Order records are retained
        for a minimum of 8 years as required under Indian tax law.
      </p>

      <h3>6. Your Rights</h3>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>Access a copy of the personal data we hold about you.</li>
        <li>Correct inaccurate or incomplete data.</li>
        <li>Request erasure of your data, subject to legal exceptions.</li>
        <li>Withdraw consent for marketing communications at any time.</li>
        <li>Lodge a complaint with the Data Protection Board of India.</li>
      </ul>

      <h3>7. Security</h3>
      <p>
        We employ industry-standard administrative, technical, and physical
        safeguards — including TLS encryption, role-based access controls,
        and regular security reviews — to protect your data. However, no
        method of transmission over the internet is 100% secure, and we
        cannot guarantee absolute security.
      </p>

      <h3>8. Children's Privacy</h3>
      <p>
        Our Platform is not directed to children under the age of 18. We do
        not knowingly collect personal data from children. If you believe a
        child has provided us with personal data, please contact us so we
        can delete it.
      </p>

      <h3>9. Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. The "Last
        Updated" date at the top reflects when the latest revisions came
        into effect. Material changes will be communicated through the
        Platform or via email where appropriate.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        For any privacy-related requests, write to our Grievance Officer at{" "}
        <a href="mailto:privacy@synergytechlabs.in" className="text-blue-600 hover:underline">
          privacy@synergytechlabs.in
        </a>
        .
      </p>
    </div>
  );
}

function Shipping() {
  return (
    <div className="prose max-w-none text-gray-700">
      <p>Last Updated: {LAST_UPDATED}</p>

      <p>
        We partner with reputed logistics providers to ensure your orders
        reach you safely and on time. This Shipping Policy outlines delivery
        timelines, charges, and what to do in case of any issues.
      </p>

      <h3>1. Shipping Coverage</h3>
      <p>
        We currently ship across all serviceable pin codes in India through
        our logistics partners. At checkout, you will be notified if your
        pin code is outside our serviceable area.
      </p>

      <h3>2. Order Processing Time</h3>
      <ul>
        <li>
          Orders are processed within <strong>1–2 business days</strong>{" "}
          (Monday–Saturday, excluding public holidays) from the date of
          successful payment confirmation.
        </li>
        <li>
          Orders placed on Sundays or public holidays are processed on the
          next business day.
        </li>
        <li>
          Bulk or custom-configuration orders may require additional
          processing time, which will be communicated via email.
        </li>
      </ul>

      <h3>3. Delivery Timelines</h3>
      <div className="overflow-x-auto not-prose my-4">
        <table className="w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">Region</th>
              <th className="text-left p-3 border-b">Estimated Delivery</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b">Metro cities (Tier 1)</td>
              <td className="p-3 border-b">2–4 business days</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Tier 2 & Tier 3 cities</td>
              <td className="p-3 border-b">4–6 business days</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Remote / North-East / J&K locations</td>
              <td className="p-3 border-b">6–9 business days</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Timelines are indicative and may vary due to weather, regional
        disruptions, or carrier constraints. Tracking information is shared
        via SMS and email once your order is dispatched.
      </p>

      <h3>4. Shipping Charges</h3>
      <ul>
        <li>
          <strong>Free shipping</strong> on orders above ₹999 (pre-tax).
        </li>
        <li>
          A flat fee of ₹79 is applicable on orders below ₹999.
        </li>
        <li>
          Additional charges may apply for bulky, heavy, or oversized
          items; any such charges will be displayed at checkout before
          payment.
        </li>
      </ul>

      <h3>5. Order Tracking</h3>
      <p>
        Once your order is dispatched, you can track it in real time via the
        <Link href="/track-order" className="text-blue-600 hover:underline"> Track Your Order</Link>{" "}
        page using your order ID and registered email/phone.
      </p>

      <h3>6. Delivery Attempts</h3>
      <p>
        Our logistics partners typically attempt delivery up to 3 times. If
        delivery fails due to incorrect address, recipient unavailability,
        or refusal to accept, the order will be returned to us and a refund
        (minus shipping and handling) will be issued after the product
        reaches our warehouse in original condition.
      </p>

      <h3>7. Damaged or Lost Shipments</h3>
      <p>
        In the rare event your shipment is damaged in transit or lost, please
        contact us within <strong>48 hours</strong> of delivery (for damage)
        or within <strong>7 days</strong> of the expected delivery date (for
        loss) at{" "}
        <a href="mailto:support@synergytechlabs.in" className="text-blue-600 hover:underline">
          support@synergytechlabs.in
        </a>
        . We will investigate with the carrier and arrange a replacement or
        full refund at no additional cost.
      </p>

      <h3>8. International Shipping</h3>
      <p>
        We currently do not ship outside India. For international enquiries,
        please contact our sales team at{" "}
        <a href="mailto:sales@synergytechlabs.in" className="text-blue-600 hover:underline">
          sales@synergytechlabs.in
        </a>
        .
      </p>
    </div>
  );
}

function Refund() {
  return (
    <div className="prose max-w-none text-gray-700">
      <p>Last Updated: {LAST_UPDATED}</p>

      <p>
        We want you to be fully satisfied with every purchase from Synergy
        Tech Labs. If something isn't right, this Return & Refund Policy
        explains how and when you can return a product and receive a refund.
      </p>

      <h3>1. Eligibility for Returns</h3>
      <ul>
        <li>Returns are accepted within <strong>7 days</strong> of delivery.</li>
        <li>
          The product must be unused, in its original packaging, with all
          tags, accessories, manuals, and seals intact.
        </li>
        <li>
          A valid invoice or proof of purchase is required for every return.
        </li>
      </ul>

      <h3>2. Non-Returnable Items</h3>
      <p>For hygiene, safety, or commercial reasons, the following items cannot be returned:</p>
      <ul>
        <li>Development boards, microcontroller modules, and ICs that have been opened or soldered.</li>
        <li>Cut-to-length cables, custom-printed PCBs, and 3D-printed parts.</li>
        <li>Software licenses, digital downloads, and gift cards.</li>
        <li>Products marked as "Non-Returnable" on the product page.</li>
        <li>Items returned beyond the 7-day window or showing signs of use, physical damage, or tampering.</li>
      </ul>

      <h3>3. Damaged, Defective, or Incorrect Items</h3>
      <p>
        If you receive a product that is damaged, defective, or not what you
        ordered, please raise a request within <strong>48 hours</strong> of
        delivery with unboxing photos and a brief description of the issue.
        Once verified, we will arrange a free reverse pickup and offer one of
        the following at your choice:
      </p>
      <ul>
        <li>Replacement with the same product (subject to availability), or</li>
        <li>A full refund to the original payment method.</li>
      </ul>

      <h3>4. Refund Process</h3>
      <ol>
        <li>Raise a return request via your Account dashboard or by emailing <a href="mailto:returns@synergytechlabs.in" className="text-blue-600 hover:underline">returns@synergytechlabs.in</a> with your order ID.</li>
        <li>Our team will review and approve the request within 1–2 business days.</li>
        <li>Schedule a reverse pickup (free for defective/incorrect items; ₹99 processing fee for change-of-mind returns).</li>
        <li>After we receive and inspect the returned product, a refund will be initiated within 3–5 business days.</li>
      </ol>

      <h3>5. Refund Timelines</h3>
      <div className="overflow-x-auto not-prose my-4">
        <table className="w-full text-sm border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 border-b">Payment Method</th>
              <th className="text-left p-3 border-b">Refund Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b">UPI / Net Banking</td>
              <td className="p-3 border-b">3–5 business days</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Credit / Debit Card</td>
              <td className="p-3 border-b">5–7 business days (depends on issuing bank)</td>
            </tr>
            <tr>
              <td className="p-3 border-b">Wallets</td>
              <td className="p-3 border-b">2–3 business days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>6. Cancellations</h3>
      <ul>
        <li>Orders can be cancelled <strong>before dispatch</strong> for a full refund from the "My Orders" section.</li>
        <li>Once dispatched, the order must be received and then returned following the standard return process.</li>
        <li>Pre-order or custom-configuration orders cannot be cancelled once production has begun.</li>
      </ul>

      <h3>7. Exchanges</h3>
      <p>
        We currently do not support direct exchanges. To swap a product,
        please initiate a return for a refund and place a new order through
        the Platform.
      </p>

      <h3>8. Contact Us</h3>
      <p>
        For any return or refund related queries, write to{" "}
        <a href="mailto:returns@synergytechlabs.in" className="text-blue-600 hover:underline">
          returns@synergytechlabs.in
        </a>{" "}
        or call <strong>+91 98425 84477</strong> (Mon–Sat, 10:00–18:00 IST).
      </p>
    </div>
  );
}

export default function Policies() {
  const [location] = useLocation();
  const path = (location.split("/").pop() || "") as PolicyKey;

  const titleMap: Record<PolicyKey, string> = {
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    shipping: "Shipping Policy",
    refund: "Return & Refund Policy",
  };

  const title = titleMap[path] ?? "Policy";

  const renderContent = () => {
    switch (path) {
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
      case "shipping":
        return <Shipping />;
      case "refund":
        return <Refund />;
      default:
        return (
          <p className="text-gray-700">
            Please select a policy from the footer links.
          </p>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
            {title}
          </h1>

          <div className="prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:my-3 prose-ul:my-3 prose-li:my-1 prose-a:text-blue-600">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

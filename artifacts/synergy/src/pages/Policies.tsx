import { Link, useLocation } from "wouter";

export default function Policies() {
  const [location] = useLocation();
  const path = location.split("/").pop();

  const getTitle = () => {
    switch (path) {
      case "privacy": return "Privacy Policy";
      case "terms": return "Terms & Conditions";
      case "shipping": return "Shipping Policy";
      case "refund": return "Return & Refund Policy";
      default: return "Policy";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">{getTitle()}</h1>
          
          <div className="prose max-w-none text-gray-700">
            <p>Last Updated: October 24, 2024</p>
            
            <h3>1. Introduction</h3>
            <p>This is a placeholder for the legal policy text. In a production environment, this would contain the actual legal language drafted by counsel for Synergy Electrical Solutions Pvt. Ltd.</p>
            
            <h3>2. Information We Collect</h3>
            <p>We collect information to provide better services to our users. We process your information for the purposes described in this policy.</p>
            
            <h3>3. How We Use Information</h3>
            <p>We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect Synergy and our users.</p>
            
            <h3>4. Contact Us</h3>
            <p>If you have any questions about this policy, please contact us at legal@synergy-electrical.in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

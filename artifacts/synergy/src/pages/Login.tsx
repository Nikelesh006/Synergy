import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Building2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { fetchApi } from "@/lib/api";

const PANEL_BG = "#0B192C";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { setUser } = useStore();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signInData.email.trim() || !signInData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetchApi<any>("/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: signInData.email.trim(),
          password: signInData.password,
        }),
      });

      if (response && response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        setSuccessMessage(`Welcome back, ${response.user.name || "Engineer"}! Redirecting...`);
        setTimeout(() => setLocation("/"), 800);
      } else {
        setErrorMessage(response?.error || "Invalid email or password.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signUpData.fullName.trim() || !signUpData.email.trim() || !signUpData.password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (signUpData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetchApi<any>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: signUpData.fullName.trim(),
          email: signUpData.email.trim(),
          phone: signUpData.phone.trim(),
          password: signUpData.password,
        }),
      });

      if (response && response.success && response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => setLocation("/"), 900);
      } else {
        setErrorMessage(response?.error || "Failed to create account.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (type: "admin" | "demo") => {
    if (type === "admin") {
      setSignInData({ email: "admin@synergy.com", password: "Admin@123" });
    } else {
      setSignInData({ email: "demo@synergy.com", password: "Demo@123" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-10 sm:py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
        
        {/* Left Side: Brand Panel */}
        <aside
          className="p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden"
          style={{ backgroundColor: PANEL_BG }}
        >
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  S
                </span>
                SYNERGY
              </span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-blue-400/20">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Powering India's Hardware
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              Enterprise Electrical & Hardware Procurement
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Connect to verified supply lines, access B2B contractor pricing, and track verified component dispatches.
            </p>

            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-md bg-blue-600/30 flex items-center justify-center shrink-0 border border-blue-500/40 text-blue-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>100% Genuine, OEM-Certified Components</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-md bg-blue-600/30 flex items-center justify-center shrink-0 border border-blue-500/40 text-blue-300">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span>GST Compliant Invoicing & Bulk Quotes</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-6 h-6 rounded-md bg-blue-600/30 flex items-center justify-center shrink-0 border border-blue-500/40 text-blue-300">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span>Priority Dispatch Across 28+ States</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 relative z-10 text-xs text-slate-400">
            Need urgent industrial support?{" "}
            <Link href="/contact" className="text-blue-400 hover:underline">
              Contact our sales desk
            </Link>
          </div>
        </aside>

        {/* Right Side: Form Panel */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMessage}
            </div>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    className="pl-9 h-11 rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions sent to your email.");
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({ ...signInData, password: e.target.value })
                    }
                    className="pl-9 pr-10 h-11 rounded-lg border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Quick Fill */}
              <div className="pt-1 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium border border-blue-200"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("demo")}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium border border-slate-200"
                >
                  Engineer
                </button>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {submitting ? "Signing in..." : "Sign In to Synergy"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    required
                    placeholder="Rohit Sharma"
                    value={signUpData.fullName}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, fullName: e.target.value })
                    }
                    className="pl-9 h-10 rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    required
                    placeholder="rohit@company.com"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    className="pl-9 h-10 rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={signUpData.phone}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, phone: e.target.value })
                    }
                    className="pl-9 h-10 rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="6+ chars"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, password: e.target.value })
                      }
                      className="pr-8 h-10 rounded-lg border-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Confirm
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Repeat"
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                      }
                      className="pr-8 h-10 rounded-lg border-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md mt-3 flex items-center justify-center gap-2"
              >
                {submitting ? "Creating Account..." : "Register Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <a
            href="http://localhost:5000/api/auth/google"
            className="w-full h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.1 14.6 1.3 12 1.3 7.8 1.3 4.2 3.8 2.5 7.4l3.4 2.6C6.7 7.2 9.1 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.4 2.6c2-1.9 3.5-4.8 3.5-8.6z"
              />
              <path
                fill="#FBBC05"
                d="M5.9 14.5c-.2-.7-.4-1.5-.4-2.5s.2-1.8.4-2.5L2.5 6.9C1.7 8.5 1.3 10.2 1.3 12s.4 3.5 1.2 5.1l3.4-2.6z"
              />
              <path
                fill="#34A853"
                d="M12 22.7c3.2 0 6-1.1 8-3l-3.4-2.6c-1.1.7-2.5 1.2-4.6 1.2-2.9 0-5.3-2.2-6.1-5.1L2.5 15.8C4.2 19.4 7.8 22.7 12 22.7z"
              />
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}

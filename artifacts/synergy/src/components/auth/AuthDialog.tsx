import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Building2,
  Globe,
  ShieldCheck,
  Truck,
  Headphones,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

type SignInFields = {
  email: string;
  password: string;
};

type SignUpFields = SignInFields & {
  fullName: string;
  phone: string;
  company: string;
  confirmPassword: string;
  agree: boolean;
};

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[+()\-\s\d]{8,}$/;

// Site brand: dark navy blue used on the left panel.
const PANEL_BG = "#1c1c30";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description: "Bank-level encryption on every transaction.",
  },
  {
    icon: Truck,
    title: "Pan-India delivery",
    description: "Tracked shipping to 27,000+ pin codes.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    description: "Talk to a real engineer, six days a week.",
  },
];

export type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: Mode;
};

export function AuthDialog({ open, onOpenChange, initialMode = "signin" }: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [signIn, setSignIn] = useState<SignInFields>({
    email: "",
    password: "",
  });
  const [signInErrors, setSignInErrors] = useState<FieldErrors<SignInFields>>(
    {}
  );

  const [signUp, setSignUp] = useState<SignUpFields>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [signUpErrors, setSignUpErrors] = useState<FieldErrors<SignUpFields>>(
    {}
  );

  // Reset the form whenever the dialog re-opens or switches mode from outside.
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSuccessMessage(null);
      setSignInErrors({});
      setSignUpErrors({});
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [open, initialMode]);

  const handleModeSwitch = (next: Mode) => {
    setMode(next);
    setSuccessMessage(null);
    setSignInErrors({});
    setSignUpErrors({});
  };

  const validateSignIn = (): boolean => {
    const errors: FieldErrors<SignInFields> = {};
    if (!signIn.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(signIn.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!signIn.password) {
      errors.password = "Password is required.";
    } else if (signIn.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUp = (): boolean => {
    const errors: FieldErrors<SignUpFields> = {};
    if (!signUp.fullName.trim()) {
      errors.fullName = "Full name is required.";
    } else if (signUp.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }
    if (!signUp.email.trim()) {
      errors.email = "Work email is required.";
    } else if (!emailRegex.test(signUp.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!signUp.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(signUp.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (!signUp.company.trim()) {
      errors.company = "Company / organisation is required.";
    }
    if (!signUp.password) {
      errors.password = "Password is required.";
    } else if (signUp.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(signUp.password) || !/\d/.test(signUp.password)) {
      errors.password = "Use 8+ chars with a number and a capital letter.";
    }
    if (!signUp.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (signUp.confirmPassword !== signUp.password) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!signUp.agree) {
      errors.agree = "You must accept the terms to continue.";
    }
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignInSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validateSignIn()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage(`Welcome back. Signing you in as ${signIn.email}…`);
    }, 700);
  };

  const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validateSignUp()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSuccessMessage(
        `Account created for ${signUp.fullName}. Check ${signUp.email} to verify.`
      );
    }, 700);
  };

  const handleGoogle = () => {
    setSuccessMessage(
      "Redirecting to Google for secure sign-in… (this is a demo placeholder)"
    );
  };

  const signInFieldClass = (key: keyof SignInFields) =>
    cn(
      "h-9 rounded-lg border bg-white pl-9 pr-3 text-xs text-gray-900 shadow-sm transition",
      "placeholder:text-gray-400 placeholder:font-normal",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:border-blue-600",
      signInErrors[key]
        ? "border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-500"
        : "border-gray-200"
    );

  const signUpFieldClass = (key: keyof SignUpFields) =>
    cn(
      "h-9 rounded-lg border bg-white pl-9 pr-3 text-xs text-gray-900 shadow-sm transition",
      "placeholder:text-gray-400 placeholder:font-normal",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:border-blue-600",
      signUpErrors[key]
        ? "border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-500"
        : "border-gray-200"
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        // Compact two-pane modal: centered with margin, capped width/height.
        className={cn(
          // Reset default centering transforms — we want a card layout, not a tiny centered box.
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          // Compact size with sensible caps.
          "w-[calc(100vw-2rem)] max-w-3xl",
          "h-auto max-h-[calc(100vh-2rem)]",
          "sm:rounded-2xl",
          "p-0 overflow-hidden",
          "bg-white",
          "border border-slate-200/80 ring-1 ring-black/5",
          "shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35),0_18px_30px_-15px_rgba(15,23,42,0.25)]",
          "before:hidden"
        )}
      >
        {/* Accessible title/description for screen readers — visually hidden */}
        <DialogTitle className="sr-only">
          {mode === "signin" ? "Sign in to Synergy" : "Create your Synergy account"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "signin"
            ? "Sign in to access your orders, saved items, and team workspace."
            : "Create a free Synergy account to manage bulk orders and access B2B pricing."}
        </DialogDescription>

        <div className="grid w-full grid-cols-1 overflow-hidden md:grid-cols-[1fr_minmax(0,1fr)]">
          {/* LEFT — dark blue panel */}
          <aside
            className="relative hidden flex-col justify-between overflow-hidden p-6 text-white md:flex md:p-8"
            style={{ backgroundColor: PANEL_BG }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 0% 0%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(50% 50% at 100% 100%, rgba(255,255,255,0.06), transparent 60%)",
              }}
            />
            <div className="relative">
              <Link href="/" className="inline-flex items-center" onClick={() => onOpenChange(false)}>
                <img
                  src="/synergy-logo.png"
                  alt="Synergy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="h-10 w-auto select-none"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </Link>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                Powering India's engineers
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                One workspace for hardware teams, makers, and procurement.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Sign in to manage bulk orders, track shipments, and access
                exclusive B2B pricing on 5,000+ components.
              </p>
            </div>

            <ul className="relative mt-10 space-y-3">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <li
                    key={h.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {h.title}
                      </p>
                      <p className="text-xs text-white/60">{h.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="relative mt-8 text-[11px] text-white/50">
              © {new Date().getFullYear()} Synergy Tech Labs. All rights
              reserved.
            </p>
          </aside>

          {/* RIGHT — white form panel */}
          <section className="relative flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto bg-white p-5 sm:p-6 md:p-7">
            {/* Explicit, prominent close button — visible on all viewports and high-contrast against white. */}
            <DialogClose
              asChild
              aria-label="Close sign-in dialog"
            >
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 md:right-4 md:top-4"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </DialogClose>

            {/* Mobile logo */}
            <div className="mb-4 flex items-center pr-12 md:hidden">
              <Link
                href="/"
                className="inline-flex items-center"
                onClick={() => onOpenChange(false)}
              >
                <img
                  src="/synergy-logo.png"
                  alt="Synergy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="h-8 w-auto select-none"
                />
              </Link>
            </div>

            <div className="mx-auto flex w-full max-w-xs flex-col">
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </p>
                <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-gray-900">
                  {mode === "signin" ? "Sign in to Synergy" : "Sign up to Synergy"}
                </h1>
                <p className="mt-0.5 text-xs text-gray-500">
                  {mode === "signin"
                    ? "Access your orders, saved items, and team workspace."
                    : "Get started with a free business account in under a minute."}
                </p>
              </div>

              {/* Tabs */}
              <div className="mb-4 inline-flex w-full rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-medium">
                {(["signin", "signup"] as Mode[]).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleModeSwitch(m)}
                      className={cn(
                        "flex-1 rounded-md px-3 py-1.5 transition",
                        active
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {m === "signin" ? "Sign in" : "Create account"}
                    </button>
                  );
                })}
              </div>

              {/* Google button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                className="h-9 w-full justify-center gap-2 rounded-lg border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <GoogleMark />
                Continue with Google
              </Button>

              {/* Divider with text */}
              <div className="my-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                <span>or continue with email</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Success message */}
              {successMessage && (
                <div className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Forms */}
              {mode === "signin" ? (
                <form
                  noValidate
                  onSubmit={handleSignInSubmit}
                  className="space-y-3"
                  aria-label="Sign in form"
                >
                  <Field
                    id="signin-email"
                    label="Email address"
                    error={signInErrors.email}
                    icon={Mail}
                  >
                    <Input
                      id="signin-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={signIn.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignIn((s) => ({ ...s, email: e.target.value }))
                      }
                      aria-invalid={Boolean(signInErrors.email)}
                      className={signInFieldClass("email")}
                    />
                  </Field>

                  <Field
                    id="signin-password"
                    label="Password"
                    error={signInErrors.password}
                    icon={Lock}
                    rightAdornment={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  >
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={signIn.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignIn((s) => ({ ...s, password: e.target.value }))
                      }
                      aria-invalid={Boolean(signInErrors.password)}
                      className={signInFieldClass("password")}
                    />
                  </Field>

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      onClick={() => onOpenChange(false)}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-9 w-full justify-center rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600/30"
                  >
                    {submitting ? "Signing in…" : "Sign in"}
                    {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    New to Synergy?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("signup")}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSignUpSubmit}
                  className="space-y-2.5"
                  aria-label="Sign up form"
                >
                  <Field
                    id="signup-name"
                    label="Full name"
                    error={signUpErrors.fullName}
                    icon={UserIcon}
                  >
                    <Input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={signUp.fullName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, fullName: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.fullName)}
                      className={signUpFieldClass("fullName")}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      id="signup-email"
                      label="Work email"
                      error={signUpErrors.email}
                      icon={Mail}
                    >
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        value={signUp.email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSignUp((s) => ({ ...s, email: e.target.value }))
                        }
                        aria-invalid={Boolean(signUpErrors.email)}
                        className={signUpFieldClass("email")}
                      />
                    </Field>
                    <Field
                      id="signup-phone"
                      label="Phone number"
                      error={signUpErrors.phone}
                      icon={Phone}
                    >
                      <Input
                        id="signup-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={signUp.phone}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSignUp((s) => ({ ...s, phone: e.target.value }))
                        }
                        aria-invalid={Boolean(signUpErrors.phone)}
                        className={signUpFieldClass("phone")}
                      />
                    </Field>
                  </div>

                  <Field
                    id="signup-company"
                    label="Company / organisation"
                    error={signUpErrors.company}
                    icon={Building2}
                  >
                    <Input
                      id="signup-company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Contractors Pvt. Ltd."
                      value={signUp.company}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, company: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.company)}
                      className={signUpFieldClass("company")}
                    />
                  </Field>

                  <Field
                    id="signup-password"
                    label="Password"
                    error={signUpErrors.password}
                    icon={Lock}
                    rightAdornment={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  >
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={signUp.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, password: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.password)}
                      className={signUpFieldClass("password")}
                    />
                  </Field>

                  <Field
                    id="signup-confirm"
                    label="Confirm password"
                    error={signUpErrors.confirmPassword}
                    icon={Lock}
                    rightAdornment={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  >
                    <Input
                      id="signup-confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={signUp.confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, confirmPassword: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.confirmPassword)}
                      className={signUpFieldClass("confirmPassword")}
                    />
                  </Field>

                  <div>
                    <label
                      className={cn(
                        "flex items-start gap-2 text-sm text-gray-600",
                        signUpErrors.agree && "text-red-600"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={signUp.agree}
                        onChange={(e) =>
                          setSignUp((s) => ({ ...s, agree: e.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span>
                        I agree to the{" "}
                        <Link
                          href="/policies/terms"
                          onClick={() => onOpenChange(false)}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/policies/privacy"
                          onClick={() => onOpenChange(false)}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {signUpErrors.agree && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {signUpErrors.agree}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-9 w-full justify-center rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600/30"
                  >
                    {submitting ? "Creating account…" : "Create account"}
                    {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
                  </Button>

                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("signin")}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <Globe className="h-3.5 w-3.5" />
                Available in English · हिन्दी · தமிழ்
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  error,
  icon: Icon,
  rightAdornment,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  icon: typeof Mail;
  rightAdornment?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "mb-1 block text-[10px] font-semibold uppercase tracking-wider",
          error ? "text-red-600" : "text-gray-600"
        )}
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon
          className={cn(
            "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2",
            error ? "text-red-400" : "text-gray-400"
          )}
        />
        {children}
        {rightAdornment && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            {rightAdornment}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.5C29.5 34.7 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.6 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.5 5.5C40.9 36.5 44 30.7 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

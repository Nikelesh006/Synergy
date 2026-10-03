import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
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
import { fetchApi } from "@/lib/api";
import { useStore } from "@/context/StoreContext";

type Mode = "signin" | "signup";

type SignInFields = {
  email: string;
  password: string;
};

type SignUpFields = SignInFields & {
  fullName: string;
  phone: string;
  confirmPassword: string;
  agree: boolean;
};

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[+()\-\s\d]{8,}$/;

// Site brand: dark navy blue used on the left panel.
const PANEL_BG = "#0f172b";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useStore();

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
      errors.email = "Email is required.";
    } else if (!emailRegex.test(signUp.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!signUp.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(signUp.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
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

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!validateSignIn()) return;
    setSubmitting(true);

    try {
      const response = await fetchApi('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: signIn.email,
          password: signIn.password,
        }),
      });

      if (response && typeof response === 'object' && 'success' in response && response.success) {
        const userData = {
          userId: (response as any).user.userId,
          email: (response as any).user.email,
          name: (response as any).user.name,
          avatar: (response as any).user.avatar,
          provider: (response as any).user.provider,
          emailVerified: (response as any).user.emailVerified,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setSuccessMessage(`Welcome back. Signing you in as ${signIn.email}…`);
        setTimeout(() => onOpenChange(false), 1000);
      } else {
        setErrorMessage((response as any)?.error || 'Failed to sign in');
      }
    } catch (error) {
      setErrorMessage('Failed to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!validateSignUp()) return;
    setSubmitting(true);

    try {
      const response = await fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          fullName: signUp.fullName,
          email: signUp.email,
          phone: signUp.phone,
          password: signUp.password,
        }),
      });

      if (response && typeof response === 'object' && 'success' in response && response.success) {
        const userData = {
          userId: (response as any).user.userId,
          email: (response as any).user.email,
          name: (response as any).user.name,
          provider: (response as any).user.provider,
          emailVerified: (response as any).user.emailVerified,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setSuccessMessage(`Account created for ${signUp.fullName}. You are now signed in.`);
        setTimeout(() => onOpenChange(false), 1500);
      } else {
        setErrorMessage((response as any)?.error || 'Failed to create account');
      }
    } catch (error) {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };

  const signInFieldClass = (key: keyof SignInFields) =>
    cn(
      "h-9 sm:h-10 rounded-full border bg-white pl-10 pr-3 text-sm text-gray-900 shadow-sm transition",
      "placeholder:text-gray-400 placeholder:font-normal",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:border-blue-600",
      signInErrors[key]
        ? "border-red-400 focus-visible:ring-red-500/20 focus-visible:border-red-500"
        : "border-gray-200"
    );

  const signUpFieldClass = (key: keyof SignUpFields) =>
    cn(
      "h-9 sm:h-10 rounded-full border bg-white pl-10 pr-3 text-sm text-gray-900 shadow-sm transition",
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
          // Slightly larger size with sensible caps.
          "w-[calc(100vw-1rem)] max-w-4xl",
          "h-auto max-h-[calc(100dvh-1rem)]",
          "sm:w-[calc(100vw-1.5rem)] sm:max-h-[calc(100dvh-1.5rem)]",
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
            <div className="relative">
              <Link
                href="/"
                className="inline-flex items-center border-0 outline-none no-underline ring-0 focus:outline-none focus:ring-0"
                onClick={() => onOpenChange(false)}
              >
                <img
                  src="/synergy-logo-footer.png"
                  alt="Synergy"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="h-20 w-auto select-none border-0 outline-none"
                />
              </Link>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                Powering India's engineers
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                One workspace for hardware teams, makers, and buyers.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Sign in to orders, track shipments, and access
                exclusive B2B pricing on various components.
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

            
          </aside>

          {/* RIGHT — white form panel */}
          <section className="relative flex flex-col overflow-y-auto bg-white p-5 sm:p-7 md:p-8 max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-1.5rem)]">
            {/* Explicit, prominent close button — visible on all viewports and high-contrast against white. */}
            <DialogClose
              asChild
              aria-label="Close sign-in dialog"
            >
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border-0 bg-transparent text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 md:right-4 md:top-4"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </DialogClose>

            {/* Mobile logo */}
            <div className="mb-3 sm:mb-4 flex items-center pr-12 md:hidden">
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
                  className="h-7 w-auto select-none sm:h-8"
                />
              </Link>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-col gap-2">
              <div className="mb-1">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </p>
                <h1 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                  {mode === "signin" ? "Sign in to Synergy" : "Sign up to Synergy"}
                </h1>
              </div>

              {/* Tabs */}
              <div
                role="tablist"
                className="relative mb-3 inline-flex w-full rounded-full border border-gray-200 bg-gray-50 p-1 text-sm font-medium"
              >
                {(["signin", "signup"] as Mode[]).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleModeSwitch(m)}
                      className={cn(
                        "relative z-10 flex-1 rounded-full px-4 py-2 transition-colors duration-300 ease-out",
                        active
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {m === "signin" ? "Sign in" : "Create account"}
                    </button>
                  );
                })}
                {/* Sliding pill indicator */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm",
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    mode === "signup" ? "translate-x-full" : "translate-x-0"
                  )}
                />
              </div>

              {/* Success message */}
              {successMessage && (
                <div className="mb-3.5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div className="mb-3.5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forms — keyed by mode so the panel crossfades on toggle */}
              <div
                key={mode}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
              >
              {mode === "signin" ? (
                <form
                  noValidate
                  onSubmit={handleSignInSubmit}
                  className="space-y-3 sm:space-y-3.5"
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
                      placeholder="name@you.com"
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
                      placeholder="Your secret"
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

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="group relative h-9 w-auto justify-center overflow-hidden rounded-full border-0 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_10px_25px_-10px_rgba(37,99,235,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2 active:translate-y-0 active:shadow-sm"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting ? "Signing in…" : "Sign in"}
                        {!submitting && (
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                        )}
                      </span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </Button>
                  </div>

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

                  {/* Divider with text */}
                  <div className="my-2.5 sm:my-3.5 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 pt-3 sm:pt-4 pb-2">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span>or</span>
                    <span className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Google button (moved to bottom) */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogle}
                    className="h-9 sm:h-10 w-full justify-center gap-2 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <GoogleMark />
                    Continue with Google
                  </Button>
                </form>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSignUpSubmit}
                  className="space-y-2.5 sm:space-y-3"
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
                      placeholder="What should we call you?"
                      value={signUp.fullName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, fullName: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.fullName)}
                      className={signUpFieldClass("fullName")}
                    />
                  </Field>

                  <Field
                    id="signup-email"
                    label="Email"
                    error={signUpErrors.email}
                    icon={Mail}
                  >
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@you.com"
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
                      placeholder="Where can we reach you?"
                      value={signUp.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSignUp((s) => ({ ...s, phone: e.target.value }))
                      }
                      aria-invalid={Boolean(signUpErrors.phone)}
                      className={signUpFieldClass("phone")}
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
                      placeholder="Make it count"
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
                      placeholder="One more time"
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

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="group relative h-9 w-auto justify-center overflow-hidden rounded-full border-0 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_10px_25px_-10px_rgba(37,99,235,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2 active:translate-y-0 active:shadow-sm"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting ? "Creating account…" : "Create account"}
                        {!submitting && (
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                        )}
                      </span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </Button>
                  </div>

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

                  {/* Divider with text */}
                  <div className="my-2.5 sm:my-3.5 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span>or</span>
                    <span className="h-px flex-1 bg-gray-200" />
                  </div>

                  {/* Google button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogle}
                    className="h-9 sm:h-10 w-full justify-center gap-2 rounded-full border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <GoogleMark />
                    Sign up with Google
                  </Button>
                </form>
              )}
              </div>
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
          "mb-1 sm:mb-1.5 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider",
          error ? "text-red-600" : "text-gray-600"
        )}
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Icon
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
            error ? "text-red-400" : "text-gray-400"
          )}
        />
        {children}
        {rightAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightAdornment}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
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

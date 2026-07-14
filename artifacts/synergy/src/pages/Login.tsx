import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/context/StoreContext";

/**
 * /login — opens the global AuthDialog over an inert background.
 * Real content lives in <AuthDialog /> rendered by AppLayout so the rest of
 * the site is blocked from interaction while the dialog is open.
 *
 * IMPORTANT: only auto-open once per visit. Re-opening the dialog whenever
 * `openAuth` changes would defeat the close button — the X would close the
 * dialog, the parent would re-render, and the effect would re-open it.
 */
export default function Login() {
  const { openAuth, authOpen } = useStore();
  const [, setLocation] = useLocation();
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    openAuth("signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the dialog was closed (X clicked, esc pressed, scrim clicked),
  // bounce the user back to the previous page so the URL matches reality.
  useEffect(() => {
    if (hasOpenedRef.current && !authOpen) {
      setLocation("/");
    }
  }, [authOpen, setLocation]);

  // Inert background — the modal handles all interaction.
  return (
    <div
      className="min-h-[calc(100vh-200px)] bg-gray-50"
      aria-hidden="true"
    />
  );
}

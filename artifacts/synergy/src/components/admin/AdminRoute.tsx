import { type ComponentType } from "react";
import { Redirect } from "wouter";
import { useStore } from "@/context/StoreContext";

interface AdminRouteProps {
  component: ComponentType<any>;
  [key: string]: any;
}

/**
 * Route guard for Admin pages.
 * Only allows access if the logged in user's email is authorized in VITE_ADMIN_EMAILS.
 * Unauthorized visitors are redirected to the home page.
 */
export default function AdminRoute({ component: Component, ...rest }: AdminRouteProps) {
  const { isAdmin } = useStore();

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

import { type ComponentType, useEffect } from "react";
import { Redirect } from "wouter";
import { useStore } from "@/context/StoreContext";
import { toast } from "@/hooks/use-toast";

interface AdminRouteProps {
  component: ComponentType<any>;
  [key: string]: any;
}

/**
 * Route guard for Admin pages.
 * Strictly verifies administrator privileges loaded from environment variables.
 * Unauthorized visitors are blocked and redirected to /login or /.
 */
export default function AdminRoute({ component: Component, ...rest }: AdminRouteProps) {
  const { user, isAdmin } = useStore();

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Administrator privileges required. Redirecting to home page.",
        variant: "destructive",
      });
    }
  }, [user, isAdmin]);

  if (!user || !isAdmin) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

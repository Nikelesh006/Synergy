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
    if (!user) {
      toast({
        title: "Administrator Authentication Required",
        description: "Please sign in with an authorized administrator account.",
        variant: "destructive",
      });
    } else if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Administrator privileges required. Your account does not have admin permissions.",
        variant: "destructive",
      });
    }
  }, [user, isAdmin]);

  if (!user) {
    return <Redirect to="/login?admin=1" />;
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

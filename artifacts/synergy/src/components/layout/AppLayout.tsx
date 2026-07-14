import { ReactNode } from "react";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useStore } from "@/context/StoreContext";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { authOpen, authInitialMode, closeAuth } = useStore();
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      {/* Global auth modal — renders above the entire site, locks scroll, traps focus. */}
      <AuthDialog
        open={authOpen}
        onOpenChange={(o) => {
          if (!o) closeAuth();
        }}
        initialMode={authInitialMode}
      />
    </div>
  );
}

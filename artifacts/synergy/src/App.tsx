import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider, useStore } from "@/context/StoreContext";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [location]);

  return null;
}

// Components
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Category from "@/pages/Category";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import AdminBlogs from "@/pages/AdminBlogs";
import AdminBlogsList from "@/pages/AdminBlogsList";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminSection from "@/pages/AdminSection";
import AdminTutorials from "@/pages/AdminTutorials";
import AdminTutorialsList from "@/pages/AdminTutorialsList";
import AdminRoute from "@/components/admin/AdminRoute";
import TrackOrder from "@/pages/TrackOrder";
import BulkEnquiry from "@/pages/BulkEnquiry";
import Services from "@/pages/Services";
import Brands from "@/pages/Brands";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import Tutorials from "@/pages/Tutorials";
import TutorialArticle from "@/pages/TutorialArticle";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Policies from "@/pages/Policies";

const queryClient = new QueryClient();

function AdminOrders() {
  return <AdminSection title="Orders" />;
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/account" component={Account} />
        <Route path="/login" component={Login} />
        <AdminRoute path="/admin/add-product" component={AdminDashboard} />
        <AdminRoute path="/admin/edit-product/:id" component={AdminDashboard} />
        <AdminRoute path="/admin/blogs-list" component={AdminBlogsList} />
        <AdminRoute path="/admin/blogs" component={AdminBlogs} />
        <AdminRoute path="/admin/add-blog" component={AdminBlogs} />
        <AdminRoute path="/admin/edit-blog/:id" component={AdminBlogs} />
        <AdminRoute path="/admin/tutorials-list" component={AdminTutorialsList} />
        <AdminRoute path="/admin/tutorials" component={AdminTutorials} />
        <AdminRoute path="/admin/add-tutorial" component={AdminTutorials} />
        <AdminRoute path="/admin/edit-tutorial/:id" component={AdminTutorials} />
        <AdminRoute path="/admin/products" component={AdminProducts} />
        <AdminRoute path="/admin/orders" component={AdminOrders} />
        <AdminRoute path="/admin" component={AdminDashboard} />
        <Route path="/track-order" component={TrackOrder} />
        <Route path="/bulk-enquiry" component={BulkEnquiry} />
        <Route path="/services" component={Services} />
        <Route path="/brands" component={Brands} />
        <Route path="/blogs" component={Blog} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogArticle} />
        <Route path="/tutorials" component={Tutorials} />
        <Route path="/tutorial/:slug" component={TutorialArticle} />
        <Route path="/contact" component={Contact} />
        <Route path="/about" component={About} />
        <Route path="/faq" component={FAQ} />
        <Route path="/policies/:type" component={Policies} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
            <OAuthCallbackHandler />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

function OAuthCallbackHandler() {
  const { setUser, closeAuth } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get("auth");
    const userParam = params.get("user");

    if (authSuccess === "success" && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        // Update store context
        setUser(userData);
        // Close auth modal
        closeAuth();
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Failed to parse user data from OAuth callback:", error);
      }
    }
  }, [setUser, closeAuth]);

  return null;
}

export default App;

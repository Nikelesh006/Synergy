import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, WishlistItem } from '../types';
import { fetchApi, refreshCsrfToken } from '../lib/api';

interface User {
  userId: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  avatar?: string;
  provider?: string;
  emailVerified?: boolean;
}

import { isEmailAdmin } from '../lib/admin';
import { toast } from '@/hooks/use-toast';
import { products as fallbackProducts } from '../data/products';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;

  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  compare: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;

  // Auth dialog — single global instance rendered in AppLayout, opened from anywhere.
  authOpen: boolean;
  authInitialMode: "signin" | "signup";
  openAuth: (mode?: "signin" | "signup") => void;
  closeAuth: () => void;

  // User authentication & Admin privilege
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAdmin: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  // User isolation: load user-scoped cart and wishlist on mount and user changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Purge legacy unisolated storage keys to prevent data leaking
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');

    if (user?.userId) {
      const userCartKey = `cart_${user.userId}`;
      const userWishlistKey = `wishlist_${user.userId}`;

      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          setCart([]);
        }
      } else {
        setCart([]);
      }

      const savedWishlist = localStorage.getItem(userWishlistKey);
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    } else {
      // Guest state: strictly zero cart and zero wishlist items
      setCart([]);
      setWishlist([]);
    }
  }, [user?.userId]);

  // Sync cart with backend database when authenticated user is active
  useEffect(() => {
    const syncCart = async () => {
      if (user?.userId) {
        try {
          const response = await fetchApi('/cart');
          if (response && typeof response === 'object' && 'cart' in response) {
            const dbCart = (response as any).cart.map((item: any) => {
              const catalogMatch = fallbackProducts.find(
                (p) =>
                  String(p.id) === String(item.productId) ||
                  String((p as any)._id) === String(item.productId) ||
                  (item.slug && p.slug === item.slug) ||
                  (item.sku && p.sku === item.sku) ||
                  p.name.toLowerCase() === String(item.name || "").toLowerCase()
              );

              const resolvedProduct: Product = catalogMatch || {
                id: String(item.productId),
                _id: String(item.productId),
                name: item.name,
                price: Number(item.price) || 0,
                images: item.image ? [item.image] : [],
                slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : String(item.productId)),
                sku: item.sku || "SYN-SKU",
                brand: "Synergy",
                category: item.category || "Hardware",
                subcategory: item.subcategory || "Components",
                shortDescription: item.name,
                description: "",
                specifications: {},
                features: [],
                applications: [],
                currency: "INR",
                stock: 50,
                inStock: true,
                minOrderQty: 1,
                rating: 4.8,
                reviewCount: 12,
                isFeatured: true,
                isNewArrival: false,
                isBestSeller: true,
                warrantyInfo: "1 Year",
                shippingInfo: "Ships within 24 hours",
              };

              return {
                product: resolvedProduct,
                quantity: Number(item.quantity) || 1,
              };
            });
            setCart(dbCart);
          }
        } catch (error) {
          console.error('Failed to sync cart from database:', error);
        }
      }
    };
    syncCart();
  }, [user?.userId]);

  // Sync wishlist with backend database when authenticated user is active
  useEffect(() => {
    const syncWishlist = async () => {
      if (user?.userId) {
        try {
          const response = await fetchApi('/wishlist');
          if (response && typeof response === 'object' && 'wishlist' in response) {
            const dbWishlist = (response as any).wishlist.map((item: any) => {
              const catalogMatch = fallbackProducts.find(
                (p) =>
                  String(p.id) === String(item.productId) ||
                  String((p as any)._id) === String(item.productId) ||
                  (item.slug && p.slug === item.slug) ||
                  (item.sku && p.sku === item.sku) ||
                  p.name.toLowerCase() === String(item.name || "").toLowerCase()
              );

              const resolvedProduct: Product = catalogMatch || {
                id: String(item.productId),
                _id: String(item.productId),
                name: item.name,
                price: Number(item.price) || 0,
                images: item.image ? [item.image] : [],
                slug: item.slug || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : String(item.productId)),
                sku: item.sku || "SYN-SKU",
                brand: "Synergy",
                category: item.category || "Hardware",
                subcategory: item.subcategory || "Components",
                shortDescription: item.name,
                description: "",
                specifications: {},
                features: [],
                applications: [],
                currency: "INR",
                stock: 50,
                inStock: true,
                minOrderQty: 1,
                rating: 4.8,
                reviewCount: 12,
                isFeatured: true,
                isNewArrival: false,
                isBestSeller: true,
                warrantyInfo: "1 Year",
                shippingInfo: "Ships within 24 hours",
              };

              return {
                product: resolvedProduct,
              };
            });
            setWishlist(dbWishlist);
          }
        } catch (error) {
          console.error('Failed to sync wishlist from database:', error);
        }
      }
    };
    syncWishlist();
  }, [user?.userId]);

  // Save cart to user-scoped localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.userId) {
      localStorage.setItem(`cart_${user.userId}`, JSON.stringify(cart));
    }
  }, [cart, user?.userId]);

  // Save wishlist to user-scoped localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.userId) {
      localStorage.setItem(`wishlist_${user.userId}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user?.userId]);

  const openAuth = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthInitialMode(mode);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const logout = useCallback(async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch {
      // Proceed even if network request fails
    }
    if (user?.userId) {
      localStorage.removeItem(`cart_${user.userId}`);
      localStorage.removeItem(`wishlist_${user.userId}`);
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setCart([]);
    setWishlist([]);
    refreshCsrfToken().catch(() => {});
    toast({
      title: "Logged out successfully",
      description: "You have been safely signed out of your account.",
    });
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user?.userId]);


  // Cart actions
  const addToCart = useCallback(async (product: Product, quantity: number) => {
    if (!user) {
      openAuth("signin");
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    const targetId = String(product.id || (product as any)._id);
    setCart(prev => {
      const existing = prev.find(item => String(item.product.id || (item.product as any)._id) === targetId);
      if (existing) {
        return prev.map(item => 
          String(item.product.id || (item.product as any)._id) === targetId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    try {
      await fetchApi('/cart', {
        method: 'POST',
        body: JSON.stringify({
          productId: targetId,
          quantity,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          slug: product.slug || targetId,
          sku: product.sku || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
        }),
      });
    } catch (error) {
      console.error('Failed to add to cart in database:', error);
    }
  }, [user, openAuth]);

  const removeFromCart = useCallback(async (productId: string) => {
    const targetId = String(productId);
    setCart(prev => prev.filter(item => String(item.product.id || (item.product as any)._id) !== targetId));

    if (user) {
      try {
        await fetchApi(`/cart/${encodeURIComponent(targetId)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to remove from cart in database:', error);
      }
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const targetId = String(productId);
    setCart(prev => prev.map(item => 
      String(item.product.id || (item.product as any)._id) === targetId ? { ...item, quantity } : item
    ));

    if (user) {
      try {
        await fetchApi(`/cart/${encodeURIComponent(targetId)}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        console.error('Failed to update cart quantity in database:', error);
      }
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (typeof window !== 'undefined' && user?.userId) {
      localStorage.removeItem(`cart_${user.userId}`);
    }
    if (user) {
      try {
        await fetchApi('/cart', {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to clear cart in database:', error);
      }
    }
  }, [user]);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  // Wishlist actions
  const addToWishlist = useCallback(async (product: Product) => {
    if (!user) {
      openAuth("signin");
      toast({
        title: "Sign In Required",
        description: "Please sign in to save items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const targetId = String(product.id || (product as any)._id);
    if (!wishlist.find(item => String(item.product.id || (item.product as any)._id) === targetId)) {
      setWishlist(prev => [...prev, { product }]);

      try {
        await fetchApi('/wishlist', {
          method: 'POST',
          body: JSON.stringify({
            productId: targetId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            slug: product.slug || targetId,
            sku: product.sku || '',
            category: product.category || '',
            subcategory: product.subcategory || '',
          }),
        });
      } catch (error) {
        console.error('Failed to add to wishlist in database:', error);
      }
    }
  }, [wishlist, user, openAuth]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const targetId = String(productId);
    setWishlist(prev => prev.filter(item => String(item.product.id || (item.product as any)._id) !== targetId));

    if (user) {
      try {
        await fetchApi(`/wishlist/${encodeURIComponent(targetId)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to remove from wishlist in database:', error);
      }
    }
  }, [user]);

  const isInWishlist = useCallback((productId: string) => {
    const targetId = String(productId);
    return wishlist.some(item => String(item.product.id || (item.product as any)._id) === targetId);
  }, [wishlist]);

  // Compare actions
  const addToCompare = useCallback((product: Product) => {
    if (compare.length < 4 && !compare.find(p => p.id === product.id)) {
      setCompare(prev => [...prev, product]);
    }
  }, [compare]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompare(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isInCompare = useCallback((productId: string) => !!compare.find(p => p.id === productId), [compare]);

  const isAdmin = useMemo(() => {
    return isEmailAdmin(user?.email);
  }, [user]);

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      compare, addToCompare, removeFromCompare, isInCompare,
      authOpen, authInitialMode, openAuth, closeAuth,
      user, setUser, logout,
      isAdmin,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { Product, CartItem, WishlistItem } from '../types';
import { fetchApi } from '../lib/api';

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

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  cartCount: number;

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

  // Load cart from localStorage on mount (for guest users)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Load wishlist from localStorage on mount (for guest users)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, []);

  // Sync cart with database when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        try {
          // Fetch cart from database
          const response = await fetchApi('/cart', {
            headers: {
              'x-user-id': user.userId,
            },
          });
          if (response && typeof response === 'object' && 'cart' in response) {
            const dbCart = (response as any).cart.map((item: any) => ({
              product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                images: item.image ? [item.image] : [],
              },
              quantity: item.quantity,
            }));
            setCart(dbCart);
          }
        } catch (error) {
          console.error('Failed to sync cart from database:', error);
        }
      }
    };
    syncCart();
  }, [user]);

  // Sync wishlist with database when user logs in
  useEffect(() => {
    const syncWishlist = async () => {
      if (user) {
        try {
          // Fetch wishlist from database
          const response = await fetchApi('/wishlist', {
            headers: {
              'x-user-id': user.userId,
            },
          });
          if (response && typeof response === 'object' && 'wishlist' in response) {
            const dbWishlist = (response as any).wishlist.map((item: any) => ({
              product: {
                id: item.productId,
                name: item.name,
                price: item.price,
                images: item.image ? [item.image] : [],
              },
            }));
            setWishlist(dbWishlist);
          }
        } catch (error) {
          console.error('Failed to sync wishlist from database:', error);
        }
      }
    };
    syncWishlist();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const openAuth = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthInitialMode(mode);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    // Clear cart and wishlist when logging out
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    // Redirect to home page if not already there
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, []);


  // Cart actions
  const addToCart = useCallback(async (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Sync with database if user is logged in
    if (user) {
      try {
        await fetchApi('/cart', {
          method: 'POST',
          headers: {
            'x-user-id': user.userId,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            name: product.name,
            price: product.price,
            image: product.images[0] || '',
          }),
        });
      } catch (error) {
        console.error('Failed to add to cart in database:', error);
      }
    }
  }, [user]);

  const removeFromCart = useCallback(async (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));

    // Sync with database if user is logged in
    if (user) {
      try {
        await fetchApi(`/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user.userId,
          },
        });
      } catch (error) {
        console.error('Failed to remove from cart in database:', error);
      }
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));

    // Sync with database if user is logged in
    if (user) {
      try {
        await fetchApi(`/cart/${productId}`, {
          method: 'PUT',
          headers: {
            'x-user-id': user.userId,
          },
          body: JSON.stringify({ quantity }),
        });
      } catch (error) {
        console.error('Failed to update cart quantity in database:', error);
      }
    }
  }, [user]);

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  // Wishlist actions
  const addToWishlist = useCallback(async (product: Product) => {
    if (!wishlist.find(item => item.product.id === product.id)) {
      setWishlist(prev => [...prev, { product }]);

      // Sync with database if user is logged in
      if (user) {
        try {
          await fetchApi('/wishlist', {
            method: 'POST',
            headers: {
              'x-user-id': user.userId,
            },
            body: JSON.stringify({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0] || '',
            }),
          });
        } catch (error) {
          console.error('Failed to add to wishlist in database:', error);
        }
      }
    }
  }, [wishlist, user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    setWishlist(prev => prev.filter(item => item.product.id !== productId));

    // Sync with database if user is logged in
    if (user) {
      try {
        await fetchApi(`/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user.userId,
          },
        });
      } catch (error) {
        console.error('Failed to remove from wishlist in database:', error);
      }
    }
  }, [user]);

  const isInWishlist = useCallback((productId: string) => !!wishlist.find(item => item.product.id === productId), [wishlist]);

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
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
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

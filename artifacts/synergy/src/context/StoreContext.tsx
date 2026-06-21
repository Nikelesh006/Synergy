import { ReactNode, createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem, WishlistItem } from '../types';

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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);

  // Cart actions
  const addToCart = (product: Product, quantity: number) => {
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
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.product.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  // Wishlist actions
  const addToWishlist = (product: Product) => {
    if (!wishlist.find(item => item.product.id === product.id)) {
      setWishlist(prev => [...prev, { product }]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => !!wishlist.find(item => item.product.id === productId);

  // Compare actions
  const addToCompare = (product: Product) => {
    if (compare.length < 4 && !compare.find(p => p.id === product.id)) {
      setCompare(prev => [...prev, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompare(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => !!compare.find(p => p.id === productId);

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      compare, addToCompare, removeFromCompare, isInCompare
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

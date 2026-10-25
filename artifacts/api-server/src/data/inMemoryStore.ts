import { seedData } from "./seed.js";
import bcrypt from "bcryptjs";

// Helper for slug generation
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export interface InMemoryUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  provider: string;
  emailVerified: boolean;
  avatar?: string;
  role?: string;
  createdAt: Date;
}

class InMemoryStore {
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  blogPosts: any[] = [];
  tutorials: any[] = [];
  users: InMemoryUser[] = [];
  orders: any[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    const getCategoryImage = (cat: string = "", sub: string = ""): string => {
      const c = `${cat} ${sub}`.toLowerCase();
      if (c.includes("iot") || c.includes("wifi")) return "/categories/iot-boards.jpg";
      if (c.includes("ai")) return "/categories/ai-boards.jpg";
      if (c.includes("robot") || c.includes("driver") || c.includes("motor")) return "/categories/robotics-boards.jpg";
      if (c.includes("lab") || c.includes("sensor") || c.includes("mr3461") || c.includes("instrument")) return "/categories/lab-equipments.jpg";
      return "/categories/embedded-boards.jpg";
    };

    // Clone products with ID and string specifications
    this.products = seedData.products.map((p, index) => {
      const hasRealImage = p.images?.some((img) => img && !img.includes("placehold.co") && !img.includes("placeholder"));
      return {
        ...p,
        images: hasRealImage ? p.images : [getCategoryImage(p.category, p.subcategory)],
        _id: `mem_prod_${index + 1}`,
        id: `mem_prod_${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    this.categories = seedData.categories.map((c, index) => ({
      ...c,
      _id: `mem_cat_${index + 1}`,
      id: `mem_cat_${index + 1}`,
    }));

    this.brands = seedData.brands.map((b, index) => ({
      ...b,
      _id: `mem_brand_${index + 1}`,
      id: `mem_brand_${index + 1}`,
    }));

    this.blogPosts = seedData.blogPosts.map((b, index) => ({
      ...b,
      _id: `mem_blog_${index + 1}`,
      id: `mem_blog_${index + 1}`,
      coverImage: b.image,
      publishDate: b.date,
      status: "Published",
      tags: [],
    }));

    this.tutorials = ((seedData as any).tutorials || []).map((t: any, index: number) => ({
      ...t,
      _id: `mem_tut_${index + 1}`,
      id: `mem_tut_${index + 1}`,
    }));

    // Pre-seed demo users
    const salt = bcrypt.genSaltSync(10);
    this.users = [
      {
        _id: "mem_user_admin",
        name: "Admin User",
        email: "admin@synergy.com",
        phone: "+91 9876543210",
        password: bcrypt.hashSync("Admin@123", salt),
        provider: "local",
        emailVerified: true,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
        role: "admin",
        createdAt: new Date(),
      },
      {
        _id: "mem_user_demo",
        name: "Demo Engineer",
        email: "demo@synergy.com",
        phone: "+91 9123456780",
        password: bcrypt.hashSync("Demo@123", salt),
        provider: "local",
        emailVerified: true,
        role: "user",
        createdAt: new Date(),
      },
    ];

    // Pre-seed sample orders for admin preview & demo
    this.orders = [
      {
        id: "mem_ord_89241",
        _id: "mem_ord_89241",
        trackingId: "SYN89241A1",
        customer: {
          name: "Ramesh Kannan",
          email: "ramesh.k@synergylabs.io",
          phone: "+91 98401 23456",
        },
        items: [
          {
            name: "ESP32-S3 AI Development Board",
            sku: "DEV-ESP32-S3",
            price: 1250,
            quantity: 2,
            image: "/categories/ai-boards.jpg",
          },
          {
            name: "Raspberry Pi 4 Model B (4GB)",
            sku: "RPI-4-4GB",
            price: 5200,
            quantity: 1,
            image: "/categories/embedded-boards.jpg",
          },
        ],
        shippingAddress: {
          fullName: "Ramesh Kannan",
          phone: "+91 98401 23456",
          addressLine1: "Flat 4B, Silicon Heights, OMR",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600096",
        },
        subtotal: 7700,
        gst: 1386,
        shippingCharge: 0,
        total: 9086,
        status: "processing",
        paymentMethod: "upi",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: "mem_ord_89240",
        _id: "mem_ord_89240",
        trackingId: "SYN89240B2",
        customer: {
          name: "Priya Sharma",
          email: "priya.sharma@techcraft.in",
          phone: "+91 97110 54321",
        },
        items: [
          {
            name: "STM32 Nucleo-64 Development Board",
            sku: "DEV-STM32-N64",
            price: 1850,
            quantity: 3,
            image: "/categories/embedded-boards.jpg",
          },
        ],
        shippingAddress: {
          fullName: "Priya Sharma",
          phone: "+91 97110 54321",
          addressLine1: "Tower C, Cyber City, DLF Phase 2",
          city: "Gurugram",
          state: "Haryana",
          pincode: "122002",
        },
        subtotal: 5550,
        gst: 999,
        shippingCharge: 0,
        total: 6549,
        status: "shipped",
        paymentMethod: "card",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
      {
        id: "mem_ord_89239",
        _id: "mem_ord_89239",
        trackingId: "SYN89239C3",
        customer: {
          name: "Dr. Anirudh Sen",
          email: "anirudh.sen@iitkgp.ac.in",
          phone: "+91 94340 98765",
        },
        items: [
          {
            name: "Digital Storage Oscilloscope 100MHz",
            sku: "LAB-DSO-100",
            price: 24500,
            quantity: 1,
            image: "/categories/lab-equipments.jpg",
          },
        ],
        shippingAddress: {
          fullName: "Dr. Anirudh Sen",
          phone: "+91 94340 98765",
          addressLine1: "Department of Electronics Engineering, IIT Kharagpur",
          city: "Kharagpur",
          state: "West Bengal",
          pincode: "721302",
        },
        subtotal: 24500,
        gst: 4410,
        shippingCharge: 0,
        total: 28910,
        status: "delivered",
        paymentMethod: "netbanking",
        paymentStatus: "paid",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
    ];
  }

  // Product helpers
  getProducts(query: Record<string, string>) {
    let list = [...this.products];
    const {
      category,
      subcategory,
      brand,
      search,
      featured,
      newArrival,
      bestSeller,
      minPrice,
      maxPrice,
      inStock,
      page = "1",
      limit = "24",
      sort = "relevance",
    } = query;

    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (subcategory) {
      list = list.filter((p) => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }
    if (brand) {
      list = list.filter((p) => p.brand?.toLowerCase() === brand.toLowerCase());
    }
    if (featured === "true") {
      list = list.filter((p) => Boolean(p.isFeatured));
    }
    if (newArrival === "true") {
      list = list.filter((p) => Boolean(p.isNewArrival));
    }
    if (bestSeller === "true") {
      list = list.filter((p) => Boolean(p.isBestSeller));
    }
    if (inStock === "true") {
      list = list.filter((p) => Boolean(p.inStock));
    }
    if (minPrice) {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "bestselling":
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const total = list.length;
    const start = (pageNum - 1) * limitNum;
    const paginated = list.slice(start, start + limitNum);

    return {
      products: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    };
  }

  getProductBySlugOrId(identifier: string) {
    if (!identifier) return null;
    const clean = decodeURIComponent(String(identifier)).trim().toLowerCase();
    return (
      this.products.find(
        (p, idx) =>
          (p.slug && p.slug.toLowerCase() === clean) ||
          (p.id && String(p.id).toLowerCase() === clean) ||
          (p._id && String(p._id).toLowerCase() === clean) ||
          (p.sku && String(p.sku).toLowerCase() === clean) ||
          String(idx + 1) === clean ||
          String(p.id).toLowerCase() === `mem_prod_${clean}`
      ) || null
    );
  }

  addProduct(data: any) {
    const slug = data.slug || slugify(data.name || "product");
    const newProd = {
      ...data,
      _id: `mem_prod_${Date.now()}`,
      id: `mem_prod_${Date.now()}`,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  updateProduct(id: string, data: any) {
    const idx = this.products.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return null;
    this.products[idx] = {
      ...this.products[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.products[idx];
  }

  deleteProduct(id: string) {
    const idx = this.products.findIndex((p) => p.id === id || p._id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Blog helpers
  addBlog(data: any) {
    const newBlog = {
      ...data,
      _id: `mem_blog_${Date.now()}`,
      id: `mem_blog_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.blogPosts.unshift(newBlog);
    return newBlog;
  }

  updateBlog(id: string, data: any) {
    const idx = this.blogPosts.findIndex((b) => b.id === id || b._id === id);
    if (idx === -1) return null;
    this.blogPosts[idx] = {
      ...this.blogPosts[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.blogPosts[idx];
  }

  deleteBlog(id: string) {
    const idx = this.blogPosts.findIndex((b) => b.id === id || b._id === id);
    if (idx === -1) return false;
    this.blogPosts.splice(idx, 1);
    return true;
  }

  // Tutorial helpers
  addTutorial(data: any) {
    const newTutorial = {
      ...data,
      _id: `mem_tut_${Date.now()}`,
      id: `mem_tut_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tutorials.unshift(newTutorial);
    return newTutorial;
  }

  updateTutorial(id: string, data: any) {
    const idx = this.tutorials.findIndex((t) => t.id === id || t._id === id);
    if (idx === -1) return null;
    this.tutorials[idx] = {
      ...this.tutorials[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.tutorials[idx];
  }

  deleteTutorial(id: string) {
    const idx = this.tutorials.findIndex((t) => t.id === id || t._id === id);
    if (idx === -1) return false;
    this.tutorials.splice(idx, 1);
    return true;
  }

  // User auth helpers
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id: string) {
    return this.users.find((u) => u._id === id) || null;
  }

  createUser(userData: { name: string; email: string; phone?: string; password?: string; provider?: string; role?: string }) {
    const newUser: InMemoryUser = {
      _id: `mem_user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      password: userData.password,
      provider: userData.provider || "local",
      emailVerified: false,
      role: userData.role || "user",
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Order helpers
  addOrder(data: any) {
    const trackingId =
      data.trackingId ||
      ("SYN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase());
    const id = data.id || data._id || `mem_ord_${Date.now()}`;
    const newOrder = {
      ...data,
      id,
      _id: id,
      trackingId,
      status: data.status || "pending",
      paymentStatus: data.paymentStatus || "pending",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrders(filter?: { userId?: string; email?: string }) {
    if (!filter || (!filter.userId && !filter.email)) {
      return [...this.orders];
    }
    return this.orders.filter((o) => {
      if (filter.userId && o.userId !== filter.userId) return false;
      if (filter.email && o.customer?.email !== filter.email) return false;
      return true;
    });
  }

  findOrder(idOrTracking: string) {
    return (
      this.orders.find(
        (o) => o.id === idOrTracking || o._id === idOrTracking || o.trackingId === idOrTracking
      ) || null
    );
  }

  updateOrder(idOrTracking: string, data: any) {
    const idx = this.orders.findIndex(
      (o) => o.id === idOrTracking || o._id === idOrTracking || o.trackingId === idOrTracking
    );
    if (idx === -1) return null;
    this.orders[idx] = {
      ...this.orders[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.orders[idx];
  }

  deleteOrder(idOrTracking: string) {
    const idx = this.orders.findIndex(
      (o) => o.id === idOrTracking || o._id === idOrTracking || o.trackingId === idOrTracking
    );
    if (idx === -1) return false;
    this.orders.splice(idx, 1);
    return true;
  }
}

export const inMemoryStore = new InMemoryStore();

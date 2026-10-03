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
    // Clone products with ID and string specifications
    this.products = seedData.products.map((p, index) => ({
      ...p,
      _id: `mem_prod_${index + 1}`,
      id: `mem_prod_${index + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

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
        createdAt: new Date(),
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
    return this.products.find((p) => p.slug === identifier || p.id === identifier || p._id === identifier) || null;
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

  // User auth helpers
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id: string) {
    return this.users.find((u) => u._id === id) || null;
  }

  createUser(userData: { name: string; email: string; phone?: string; password?: string; provider?: string }) {
    const newUser: InMemoryUser = {
      _id: `mem_user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      password: userData.password,
      provider: userData.provider || "local",
      emailVerified: false,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const inMemoryStore = new InMemoryStore();

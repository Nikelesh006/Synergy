import mongoose from 'mongoose';

// User Model
export interface IUser {
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  googleId?: string;
  avatar?: string;
  emailVerified?: boolean;
  provider?: "local" | "google";
  phone?: string;
  password?: string;
  cart?: Array<{
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }>;
  wishlist?: Array<{
    productId: string;
    name: string;
    price: number;
    image: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    givenName: {
      type: String,
    },
    familyName: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    cart: [{
      productId: String,
      quantity: Number,
      name: String,
      price: Number,
      image: String,
    }],
    wishlist: [{
      productId: String,
      name: String,
      price: Number,
      image: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);

// Re-export models from separate files
export { Product } from './Product.js';
export { Category } from './Category.js';
export { Brand } from './Brand.js';

// Order Model
export interface IOrder {
  userId: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    items: [{
      productId: String,
      quantity: Number,
      price: Number,
    }],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);

// Blog Model
export interface IBlog {
  title: string;
  slug: string;
  author: string;
  category: string;
  status: string;
  publishDate: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Review', 'Published', 'Archived'],
      default: 'Draft',
    },
    publishDate: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);

// Tutorial Model
export interface ITutorial {
  title: string;
  slug: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  channelName: string;
  instructor: string;
  category: string;
  level: string;
  status: string;
  duration: string;
  publishDate: string;
  shortDescription: string;
  description: string;
  tags: string[];
  resourcesUrl: string;
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tutorialSchema = new mongoose.Schema<ITutorial>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    channelName: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Review', 'Published', 'Archived'],
      default: 'Draft',
    },
    duration: {
      type: String,
      required: true,
    },
    publishDate: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
    }],
    resourcesUrl: {
      type: String,
    },
    metaTitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Tutorial = mongoose.model<ITutorial>('Tutorial', tutorialSchema);

// Enquiry Model
export interface IEnquiry {
  companyName: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new mongoose.Schema<IEnquiry>(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);

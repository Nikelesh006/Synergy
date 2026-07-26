import mongoose, { Schema, type Document } from "mongoose";

interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  trackingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  gst: number;
  shippingCharge: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: String,
    name: String,
    sku: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  { _id: false },
);

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    trackingId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    subtotal: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: String,
  },
  { timestamps: true },
);

orderSchema.index({ "customer.email": 1 });

export const Order = mongoose.models["Order"] ?? mongoose.model<IOrder>("Order", orderSchema);

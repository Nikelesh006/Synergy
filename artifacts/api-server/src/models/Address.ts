import mongoose from 'mongoose';

export interface IAddress {
  userId: string;
  type: string;
  name: string;
  line1: string;
  line2: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new mongoose.Schema<IAddress>(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'Office',
    },
    name: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model<IAddress>('Address', addressSchema);

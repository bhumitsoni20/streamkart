import mongoose, { Schema, Document } from 'mongoose';

export interface ISellerApplication extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  description: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const sellerApplicationSchema = new Schema<ISellerApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const SellerApplication = mongoose.model<ISellerApplication>('SellerApplication', sellerApplicationSchema);

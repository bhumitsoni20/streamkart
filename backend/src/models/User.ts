import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  firebaseUid: string;
  role: 'user' | 'seller' | 'admin';
  sellerStatus: 'none' | 'pending' | 'approved' | 'rejected';
  applicationSubmittedAt?: Date;
  approvedAt?: Date;
  avatar?: string;
  isVerified: boolean;
  verificationSource?: 'none' | 'automatic' | 'admin';
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  unverifiedAt?: Date;
  unverifiedBy?: mongoose.Types.ObjectId;
  fcmToken?: string;
  badReviewCount: number;
  suspensionExpiry?: Date;
  probationExpiry?: Date;
  createdAt: Date;
  walletBalance: number;
  upiId?: string;
  upiQrCode?: string;
  notificationPreferences?: {
    pushEnabled: boolean;
    orderUpdates: boolean;
    chatMessages: boolean;
    paymentUpdates: boolean;
    accountAlerts: boolean;
  };
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
    sellerStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    applicationSubmittedAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
    avatar: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationSource: {
      type: String,
      enum: ['none', 'automatic', 'admin'],
      default: 'none',
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    unverifiedAt: {
      type: Date,
    },
    unverifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fcmToken: {
      type: String,
      default: '',
    },
    badReviewCount: {
      type: Number,
      default: 0,
    },
    suspensionExpiry: {
      type: Date,
    },
    probationExpiry: {
      type: Date,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    upiId: {
      type: String,
      trim: true,
      default: '',
    },
    upiQrCode: {
      type: String,
      default: '',
    },
    notificationPreferences: {
      pushEnabled: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      chatMessages: { type: Boolean, default: true },
      paymentUpdates: { type: Boolean, default: true },
      accountAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);

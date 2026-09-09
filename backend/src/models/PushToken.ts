import mongoose, { Schema, Document } from 'mongoose';

export interface IPushToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  deviceId?: string;
  platform?: 'web' | 'android' | 'ios' | string;
  browser?: string;
  userAgent?: string;
  isActive: boolean;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pushTokenSchema = new Schema<IPushToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    deviceId: {
      type: String,
      trim: true,
      default: '',
    },
    platform: {
      type: String,
      trim: true,
      default: 'web',
    },
    browser: {
      type: String,
      trim: true,
      default: '',
    },
    userAgent: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

pushTokenSchema.index({ user: 1, isActive: 1 });

export const PushToken = mongoose.model<IPushToken>('PushToken', pushTokenSchema);

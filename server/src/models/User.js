import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
    photoURL: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free',
    },
    limits: {
      maxQRs: {
        type: Number,
        default: 50,
      },
      maxDynamicQRs: {
        type: Number,
        default: 25,
      },
      analyticsRetentionDays: {
        type: Number,
        default: 90,
      },
    },
    metadata: {
      lastLoginAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

export const User = mongoose.model('User', userSchema);

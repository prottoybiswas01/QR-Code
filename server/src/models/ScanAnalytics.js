import mongoose from 'mongoose';

const scanAnalyticsSchema = new mongoose.Schema(
  {
    qrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'smarttv', 'console', 'wearable', 'unknown'],
      default: 'unknown',
    },
    os: {
      type: String,
      default: 'Unknown OS',
    },
    browser: {
      type: String,
      default: 'Unknown Browser',
    },
    ipHash: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    referer: {
      type: String,
      default: 'Direct / Scanner',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for fast aggregation in dashboard
scanAnalyticsSchema.index({ qrId: 1, timestamp: -1 });
scanAnalyticsSchema.index({ slug: 1, timestamp: -1 });
scanAnalyticsSchema.index({ timestamp: -1 });

export const ScanAnalytics = mongoose.model('ScanAnalytics', scanAnalyticsSchema);

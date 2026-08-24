import mongoose from 'mongoose';

const systemBugLogSchema = new mongoose.Schema(
  {
    errorType: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
      default: '',
    },
    componentStack: {
      type: String,
      default: '',
    },
    route: {
      type: String,
      default: '/',
    },
    deviceInfo: {
      userAgent: String,
      browser: String,
      os: String,
      deviceType: String,
    },
    status: {
      type: String,
      enum: ['detected', 'auto-healed', 'resolved', 'patch-ready'],
      default: 'auto-healed',
      index: true,
    },
    aiAnalysis: {
      rootCause: String,
      patchSummary: String,
      confidenceScore: { type: Number, default: 95 },
      suggestedFix: String,
      autoApplied: { type: Boolean, default: true },
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

systemBugLogSchema.index({ occurredAt: -1 });
systemBugLogSchema.index({ status: 1 });

export const SystemBugLog = mongoose.model('SystemBugLog', systemBugLogSchema);

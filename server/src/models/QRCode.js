import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'QR Code name is required'],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      enum: [
        'url',
        'text',
        'facebook',
        'instagram',
        'whatsapp',
        'email',
        'phone',
        'sms',
        'wifi',
        'vcard',
        'location',
      ],
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ['dynamic', 'static'],
      default: 'dynamic',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    shortUrl: {
      type: String,
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
      default: '',
    },
    // Type-specific structured metadata
    metadata: {
      // Wi-Fi fields
      ssid: { type: String, default: '' },
      password: { type: String, default: '' },
      encryption: { type: String, enum: ['WPA/WPA2', 'WPA3', 'WEP', 'nopass'], default: 'WPA/WPA2' },
      hidden: { type: Boolean, default: false },

      // vCard fields
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      company: { type: String, default: '' },
      title: { type: String, default: '' },
      website: { type: String, default: '' },
      address: { type: String, default: '' },
      note: { type: String, default: '' },

      // WhatsApp / SMS / Phone
      countryCode: { type: String, default: '' },
      recipient: { type: String, default: '' },
      message: { type: String, default: '' },

      // Email
      subject: { type: String, default: '' },
      body: { type: String, default: '' },

      // Location
      latitude: { type: Number },
      longitude: { type: Number },
      addressLabel: { type: String, default: '' },
    },
    // Visual Customization parameters
    customization: {
      fgColor: { type: String, default: '#000000' },
      bgColor: { type: String, default: '#ffffff' },
      gradient: {
        type: { type: String, enum: ['none', 'linear', 'radial'], default: 'none' },
        color1: { type: String, default: '#4f46e5' },
        color2: { type: String, default: '#06b6d4' },
        rotation: { type: Number, default: 0 },
      },
      dotsType: {
        type: String,
        enum: ['square', 'dots', 'rounded', 'extra-rounded', 'classy', 'classy-rounded'],
        default: 'rounded',
      },
      cornersSquareType: {
        type: String,
        enum: ['square', 'dot', 'extra-rounded'],
        default: 'extra-rounded',
      },
      cornersDotType: {
        type: String,
        enum: ['square', 'dot'],
        default: 'dot',
      },
      cornersSquareColor: { type: String, default: '' },
      cornersDotColor: { type: String, default: '' },
      logoUrl: { type: String, default: '' },
      logoMargin: { type: Number, default: 5 },
      logoSize: { type: Number, default: 0.2 },
      errorCorrectionLevel: {
        type: String,
        enum: ['L', 'M', 'Q', 'H'],
        default: 'Q',
      },
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'disabled'],
      default: 'active',
      index: true,
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    lastScannedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Composite & lookup indexes for performance
qrCodeSchema.index({ userId: 1, createdAt: -1 });
qrCodeSchema.index({ slug: 1 });
qrCodeSchema.index({ status: 1 });
qrCodeSchema.index({ type: 1 });

export const QRCode = mongoose.model('QRCode', qrCodeSchema);

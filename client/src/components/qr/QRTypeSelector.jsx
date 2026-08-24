import React from 'react';
import {
  Globe,
  Wifi,
  Contact,
  MessageSquare,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const QR_TYPES = [
  {
    id: 'url',
    label: 'Website URL',
    icon: Globe,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    description: 'Direct link to any website or landing page',
    isDynamicPopular: true,
  },
  {
    id: 'wifi',
    label: 'Wi-Fi Network',
    icon: Wifi,
    color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
    description: 'Dynamic Wi-Fi portal with editable password',
    badge: 'Popular',
    isDynamicPopular: true,
  },
  {
    id: 'vcard',
    label: 'vCard / Contact',
    icon: Contact,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
    description: 'Digital business card with 1-click contact download',
    isDynamicPopular: true,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageSquare,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    description: 'Open chat with pre-written message template',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
    description: 'Link directly to Facebook profile or business page',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/60',
    description: 'Link directly to Instagram user profile',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    description: 'Pre-filled email with recipient, subject & body',
  },
  {
    id: 'phone',
    label: 'Phone Call',
    icon: Phone,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
    description: 'Instantly dial a phone number',
  },
  {
    id: 'sms',
    label: 'SMS Message',
    icon: MessageCircle,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60',
    description: 'Send text message with optional preset content',
  },
  {
    id: 'text',
    label: 'Plain Text',
    icon: FileText,
    color: 'text-slate-600 bg-slate-100 dark:bg-slate-800',
    description: 'Display custom text, discount codes, or notes',
  },
  {
    id: 'location',
    label: 'Location / Map',
    icon: MapPin,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
    description: 'Open coordinates in Google or Apple Maps',
  },
];

export const QRTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          Select QR Code Type
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          11 formats supported
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {QR_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectType(t.id)}
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
              }`}
            >
              {t.badge && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded">
                  {t.badge}
                </span>
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${t.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                {t.label}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                {t.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

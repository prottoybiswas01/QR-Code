import React from 'react';
import { Wifi, Eye, EyeOff, Info, HelpCircle, MapPin, Sparkles } from 'lucide-react';

export const QRFormInputs = ({
  type,
  mode,
  destination,
  setDestination,
  metadata,
  setMetadata,
}) => {
  const [showWifiPassword, setShowWifiPassword] = React.useState(false);

  const updateMeta = (field, val) => {
    setMetadata((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-4">
      {/* 1. URL */}
      {type === 'url' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Website Destination URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="https://yourwebsite.com/landing-page"
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
            required
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'dynamic'
              ? '✨ Dynamic Mode: You can change this destination link anytime from Dashboard without changing the printed QR image.'
              : 'Static Mode: Link is hardcoded into the QR code.'}
          </p>
        </div>
      )}

      {/* 2. Wi-Fi (Dynamic Architecture) */}
      {type === 'wifi' && (
        <div className="space-y-3.5 p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-900/50">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300">
            <Wifi className="w-4 h-4 text-sky-500" />
            Dynamic Wi-Fi Network Configuration
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Network Name (SSID) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={metadata.ssid || ''}
              onChange={(e) => {
                updateMeta('ssid', e.target.value);
                setDestination(e.target.value);
              }}
              placeholder="e.g. CoffeeShop_Guest_5G"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Wi-Fi Password
            </label>
            <div className="relative">
              <input
                type={showWifiPassword ? 'text' : 'password'}
                value={metadata.password || ''}
                onChange={(e) => updateMeta('password', e.target.value)}
                placeholder="Enter network password (leave blank for Open)"
                className="w-full pl-3.5 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowWifiPassword(!showWifiPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Encryption
              </label>
              <select
                value={metadata.encryption || 'WPA/WPA2'}
                onChange={(e) => updateMeta('encryption', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
              >
                <option value="WPA/WPA2">WPA / WPA2 (Default)</option>
                <option value="WPA3">WPA3 (Modern)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={!!metadata.hidden}
                  onChange={(e) => updateMeta('hidden', e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                Hidden SSID Network
              </label>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-sky-100/60 dark:bg-sky-950/40 text-[11px] text-sky-900 dark:text-sky-200 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" />
            <span>
              <strong>Dynamic Wi-Fi Advantage:</strong> When printed at a restaurant, office, or counter, you can change the Wi-Fi password in the dashboard anytime without reprinting your posters!
            </span>
          </div>
        </div>
      )}

      {/* 3. vCard / Digital Contact Card */}
      {type === 'vcard' && (
        <div className="space-y-3 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50">
          <div className="text-xs font-bold text-purple-800 dark:text-purple-300">
            Contact Card (vCard 3.0) Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                value={metadata.firstName || ''}
                onChange={(e) => updateMeta('firstName', e.target.value)}
                placeholder="John"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                value={metadata.lastName || ''}
                onChange={(e) => updateMeta('lastName', e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={metadata.phone || ''}
                onChange={(e) => updateMeta('phone', e.target.value)}
                placeholder="+1 (555) 000-1234"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={metadata.email || ''}
                onChange={(e) => updateMeta('email', e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Org</label>
              <input
                type="text"
                value={metadata.company || ''}
                onChange={(e) => updateMeta('company', e.target.value)}
                placeholder="Acme Inc."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={metadata.title || ''}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Founder & CEO"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Website URL</label>
            <input
              type="url"
              value={metadata.website || ''}
              onChange={(e) => updateMeta('website', e.target.value)}
              placeholder="https://johndoe.me"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
            <input
              type="text"
              value={metadata.address || ''}
              onChange={(e) => updateMeta('address', e.target.value)}
              placeholder="123 Innovation Way, Suite 400, New York, NY"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* 4. WhatsApp */}
      {type === 'whatsapp' && (
        <div className="space-y-3 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp Phone Number (with Country Code) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={metadata.recipient || destination || ''}
              onChange={(e) => {
                updateMeta('recipient', e.target.value);
                setDestination(e.target.value);
              }}
              placeholder="e.g. +14155552671 or +8801700000000"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default Pre-written Message (Optional)
            </label>
            <textarea
              value={metadata.message || ''}
              onChange={(e) => updateMeta('message', e.target.value)}
              placeholder="Hi, I am reaching out from your QR Code campaign!"
              rows={3}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none"
            />
          </div>
        </div>
      )}

      {/* 5. Facebook */}
      {type === 'facebook' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Facebook Page or Profile Link <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="https://facebook.com/yourbrandpage"
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            required
          />
        </div>
      )}

      {/* 6. Instagram */}
      {type === 'instagram' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Instagram Profile URL or Handle <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="https://instagram.com/yourprofile or @yourhandle"
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
            required
          />
        </div>
      )}

      {/* 7. Email */}
      {type === 'email' && (
        <div className="space-y-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipient Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={metadata.recipient || destination || ''}
              onChange={(e) => {
                updateMeta('recipient', e.target.value);
                setDestination(e.target.value);
              }}
              placeholder="contact@company.com"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
            <input
              type="text"
              value={metadata.subject || ''}
              onChange={(e) => updateMeta('subject', e.target.value)}
              placeholder="Inquiry regarding services"
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Body Text</label>
            <textarea
              value={metadata.body || ''}
              onChange={(e) => updateMeta('body', e.target.value)}
              placeholder="Write pre-filled email body..."
              rows={3}
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white resize-none"
            />
          </div>
        </div>
      )}

      {/* 8. Phone */}
      {type === 'phone' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Phone Number to Dial <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              updateMeta('recipient', e.target.value);
            }}
            placeholder="+1 800 555 0199"
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            required
          />
        </div>
      )}

      {/* 9. SMS */}
      {type === 'sms' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={metadata.recipient || destination || ''}
              onChange={(e) => {
                updateMeta('recipient', e.target.value);
                setDestination(e.target.value);
              }}
              placeholder="+1 800 555 0199"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Pre-written SMS Body
            </label>
            <textarea
              value={metadata.message || ''}
              onChange={(e) => updateMeta('message', e.target.value)}
              placeholder="SEND CODE 123"
              rows={2}
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white resize-none"
            />
          </div>
        </div>
      )}

      {/* 10. Plain Text */}
      {type === 'text' && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Custom Text or Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Type any message, coupon code, instruction, or details to display on scan..."
            rows={4}
            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
            required
          />
        </div>
      )}

      {/* 11. Location */}
      {type === 'location' && (
        <div className="space-y-3 p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50">
          <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Location Coordinates or Address
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={metadata.latitude || ''}
                onChange={(e) => updateMeta('latitude', parseFloat(e.target.value) || '')}
                placeholder="40.7128"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={metadata.longitude || ''}
                onChange={(e) => updateMeta('longitude', parseFloat(e.target.value) || '')}
                placeholder="-74.0060"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location Label / Search Address</label>
            <input
              type="text"
              value={destination || metadata.addressLabel || ''}
              onChange={(e) => {
                setDestination(e.target.value);
                updateMeta('addressLabel', e.target.value);
              }}
              placeholder="Times Square, New York, NY"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

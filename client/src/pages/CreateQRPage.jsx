import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  QrCode,
  ArrowRight,
  Info,
  CheckCircle2,
  Save,
  HelpCircle,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { QRTypeSelector } from '../components/qr/QRTypeSelector';
import { QRFormInputs } from '../components/qr/QRFormInputs';
import { QRCustomizer } from '../components/qr/QRCustomizer';
import { QRPreview } from '../components/qr/QRPreview';
import { QRDownloadModal } from '../components/qr/QRDownloadModal';
import { buildQRPayload } from '../utils/qrPayloadBuilder';
import { useToast } from '../context/ToastContext';

export const CreateQRPage = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'wifi' ? 'wifi' : 'url';

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [name, setName] = useState('');
  const [type, setType] = useState(initialType);
  const [mode, setMode] = useState('dynamic'); // 'dynamic' | 'static'
  const [destination, setDestination] = useState('');
  const [metadata, setMetadata] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA/WPA2',
    hidden: false,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    website: '',
    address: '',
    note: '',
    recipient: '',
    message: '',
    subject: '',
    body: '',
    latitude: '',
    longitude: '',
    addressLabel: '',
  });

  const [customization, setCustomization] = useState({
    fgColor: '#000000',
    bgColor: '#ffffff',
    gradient: { type: 'none', color1: '#4f46e5', color2: '#06b6d4', rotation: 45 },
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    cornersSquareColor: '',
    cornersDotColor: '',
    logoUrl: '',
    logoMargin: 5,
    logoSize: 0.22,
    errorCorrectionLevel: 'Q',
  });

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Compute live preview payload
  const previewPayload = buildQRPayload(type, mode, destination, metadata);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => qrService.createQRCode(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['userQRs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      toast.success(
        mode === 'dynamic'
          ? '🎉 Dynamic QR Code created! You can change this destination anytime without reprinting.'
          : 'Static QR Code created successfully!'
      );
      navigate('/my-qrs');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create QR Code. Please check inputs.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalName = name.trim() || `${type.charAt(0).toUpperCase() + type.slice(1)} QR ${new Date().toLocaleDateString()}`;

    if (type === 'wifi' && !metadata.ssid?.trim()) {
      toast.error('Please specify the Wi-Fi Network Name (SSID).');
      return;
    }

    if (type === 'url' && !destination.trim()) {
      toast.error('Please specify the destination website URL.');
      return;
    }

    const payload = {
      name: finalName,
      type,
      mode,
      destination: destination.trim(),
      metadata,
      customization,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Create QR Code
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Design your custom QR code with editable dynamic URLs or static protocols
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Configuration Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Name & Dynamic/Static Toggle */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  QR Code Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Promo, Shop WiFi, Business Card"
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              {/* Dynamic vs Static Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  QR Behavior Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('dynamic')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mode === 'dynamic'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        Dynamic QR
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Change destination link or Wi-Fi password anytime without reprinting your physical QR code.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('static')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      mode === 'static'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-slate-500" />
                        Static QR
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      Data is hardcoded directly into pixels. Destination cannot be edited after printing.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. QR Type Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <QRTypeSelector selectedType={type} onSelectType={(t) => setType(t)} />
            </div>

            {/* 3. Type-specific Input Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <QRFormInputs
                type={type}
                mode={mode}
                destination={destination}
                setDestination={setDestination}
                metadata={metadata}
                setMetadata={setMetadata}
              />
            </div>

            {/* 4. Visual Customizer */}
            <QRCustomizer
              customization={customization}
              setCustomization={setCustomization}
            />

            {/* 5. Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {createMutation.isPending ? 'Creating QR Code...' : 'Save & Generate QR Code'}
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Live Preview (5 cols) */}
          <div className="lg:col-span-5">
            <QRPreview
              payload={previewPayload}
              customization={customization}
              mode={mode}
              name={name || 'QR Preview'}
              onOpenDownloadModal={() => setDownloadModalOpen(true)}
            />
          </div>
        </div>
      </form>

      {/* Download Resolution Modal */}
      <QRDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        payload={previewPayload}
        customization={customization}
        qrName={name || 'custom_qr'}
      />
    </div>
  );
};

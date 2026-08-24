import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Wifi,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Sparkles,
  QrCode,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { useToast } from '../context/ToastContext';

export const PublicQRViewPage = () => {
  const { slug } = useParams();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch Public QR Data
  const { data: qrResponse, isLoading, isError } = useQuery({
    queryKey: ['publicQR', slug],
    queryFn: () => qrService.getPublicQRData(slug),
    retry: 1,
  });

  const qr = qrResponse?.data;

  const handleCopy = (text, label = 'Copied') => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download .vcf file for vCard contact
  const handleDownloadVCard = () => {
    if (!qr || qr.type !== 'vcard') return;
    const meta = qr.metadata || {};
    const fn = `${meta.firstName || ''} ${meta.lastName || ''}`.trim() || qr.name || 'Contact';

    let vcardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${fn}\nN:${meta.lastName || ''};${meta.firstName || ''};;;\n`;
    if (meta.company) vcardContent += `ORG:${meta.company}\n`;
    if (meta.title) vcardContent += `TITLE:${meta.title}\n`;
    if (meta.phone) vcardContent += `TEL;TYPE=CELL:${meta.phone}\n`;
    if (meta.email) vcardContent += `EMAIL:${meta.email}\n`;
    if (meta.website) vcardContent += `URL:${meta.website}\n`;
    if (meta.address) vcardContent += `ADR;TYPE=WORK:;;${meta.address};;;;\n`;
    if (meta.note) vcardContent += `NOTE:${meta.note}\n`;
    vcardContent += `END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fn.replace(/[^a-z0-9]/gi, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Contact file (.vcf) downloaded!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Connecting to Dynamic QR...</p>
        </div>
      </div>
    );
  }

  if (isError || !qr) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            QR Code Not Found
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            This QR code may have been removed, expired, or the link is invalid.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl"
          >
            Go to QRFlex Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Dynamic Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{qr.name}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. DYNAMIC WI-FI VIEW */}
          {qr.type === 'wifi' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
                  <Wifi className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                    Network Name (SSID)
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {qr.metadata?.ssid || 'Guest Network'}
                  </h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                    {qr.metadata?.encryption || 'WPA2'} Security
                    {qr.metadata?.hidden ? ' • Hidden SSID' : ''}
                  </span>
                </div>

                {/* Password Display Box */}
                {qr.metadata?.password ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-left font-mono">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Current Password
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white tracking-wider">
                          {showPassword ? qr.metadata.password : '••••••••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(qr.metadata.password, 'Wi-Fi Password')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Password Copied!' : 'Copy Wi-Fi Password'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Open Network — No Password Required
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-500" />
                  How to Connect:
                </p>
                <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                  <li>Click <strong>Copy Wi-Fi Password</strong> above.</li>
                  <li>Open your phone's <strong>Wi-Fi Settings</strong>.</li>
                  <li>Select network <strong>"{qr.metadata?.ssid || 'WiFi'}"</strong> and paste password.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 2. VCARD / CONTACT VIEW */}
          {qr.type === 'vcard' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xl flex items-center justify-center shadow-lg">
                  {((qr.metadata?.firstName || qr.name)[0] || 'C').toUpperCase()}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {`${qr.metadata?.firstName || ''} ${qr.metadata?.lastName || ''}`.trim() || qr.name}
                  </h3>
                  {qr.metadata?.title && (
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                      {qr.metadata.title} {qr.metadata.company ? `at ${qr.metadata.company}` : ''}
                    </p>
                  )}
                </div>

                {/* 1-Click Save Contact Button */}
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Save to Phone Contacts (.vcf)
                </button>
              </div>

              {/* Contact details list */}
              <div className="space-y-2 text-xs">
                {qr.metadata?.phone && (
                  <a
                    href={`tel:${qr.metadata.phone}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {qr.metadata.phone}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Call
                    </span>
                  </a>
                )}

                {qr.metadata?.email && (
                  <a
                    href={`mailto:${qr.metadata.email}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {qr.metadata.email}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Email
                    </span>
                  </a>
                )}

                {qr.metadata?.website && (
                  <a
                    href={qr.metadata.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {qr.metadata.website}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Visit
                    </span>
                  </a>
                )}

                {qr.metadata?.address && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {qr.metadata.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. PLAIN TEXT VIEW */}
          {qr.type === 'text' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                  Content Note
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {qr.destination}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(qr.destination, 'Text')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-95"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
          )}

          {/* 4. LOCATION VIEW */}
          {qr.type === 'location' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-3">
                <MapPin className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {qr.metadata?.addressLabel || qr.destination || 'Pinned Location'}
                </h3>
                {qr.metadata?.latitude && (
                  <p className="text-xs font-mono text-slate-500">
                    {qr.metadata.latitude}, {qr.metadata.longitude}
                  </p>
                )}

                <a
                  href={
                    qr.metadata?.latitude
                      ? `https://www.google.com/maps?q=${qr.metadata.latitude},${qr.metadata.longitude}`
                      : `https://www.google.com/maps?q=${encodeURIComponent(qr.destination)}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Powered by Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-indigo-500" />
          <span>Powered by QRFlex Dynamic Engine</span>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import {
  Edit3,
  Download,
  Copy,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  BarChart2,
  Wifi,
  Globe,
  Contact,
  MessageSquare,
  FileText,
  MapPin,
  Check,
  MoreVertical,
} from 'lucide-react';
import { buildQRPayload } from '../../utils/qrPayloadBuilder';
import { useToast } from '../../context/ToastContext';

export const QRCard = ({
  qr,
  onOpenDownload,
  onDuplicate,
  onDeleteRequest,
  onToggleStatus,
}) => {
  const containerRef = useRef(null);
  const qrInstance = useRef(null);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();

  const finalPayload =
    qr.mode === 'dynamic'
      ? qr.shortUrl || `${window.location.origin}/q/${qr.slug}`
      : buildQRPayload(qr.type, 'static', qr.destination, qr.metadata);

  useEffect(() => {
    const cust = qr.customization || {};
    const dotsOptions = {
      type: cust.dotsType || 'rounded',
      color: cust.fgColor || '#000000',
    };

    if (cust.gradient && cust.gradient.type === 'linear') {
      dotsOptions.gradient = {
        type: 'linear',
        rotation: (cust.gradient.rotation || 0) * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: cust.gradient.color1 || '#4f46e5' },
          { offset: 1, color: cust.gradient.color2 || '#06b6d4' },
        ],
      };
    }

    const options = {
      width: 140,
      height: 140,
      type: 'canvas',
      data: finalPayload,
      image: cust.logoUrl || undefined,
      dotsOptions,
      backgroundOptions: {
        color: cust.bgColor || '#ffffff',
      },
      cornersSquareOptions: {
        type: cust.cornersSquareType || 'extra-rounded',
        color: cust.cornersSquareColor || cust.fgColor || '#000000',
      },
      cornersDotOptions: {
        type: cust.cornersDotType || 'dot',
        color: cust.cornersDotColor || cust.fgColor || '#000000',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: cust.logoMargin ?? 4,
        imageSize: cust.logoSize ?? 0.2,
        hideBackgroundDots: true,
      },
      qrOptions: {
        errorCorrectionLevel: cust.errorCorrectionLevel || (cust.logoUrl ? 'H' : 'Q'),
      },
    };

    if (!qrInstance.current) {
      qrInstance.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrInstance.current.append(containerRef.current);
      }
    } else {
      qrInstance.current.update(options);
    }
  }, [qr, finalPayload]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPayload);
    setCopied(true);
    toast.success('Permanent QR link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-sky-500" />;
      case 'vcard':
        return <Contact className="w-3.5 h-3.5 text-purple-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-rose-500" />;
      case 'text':
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Type badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {getTypeIcon(qr.type)}
              <span className="capitalize">{qr.type}</span>
            </span>

            {/* Dynamic / Static tag */}
            {qr.mode === 'dynamic' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Dynamic
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                Static
              </span>
            )}
          </div>

          {/* Status badge */}
          <button
            onClick={() => onToggleStatus && onToggleStatus(qr)}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
              qr.status === 'active'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 hover:bg-amber-100'
            }`}
            title="Click to toggle status"
          >
            {qr.status === 'active' ? 'Active' : 'Paused'}
          </button>
        </div>

        {/* Name & Destination */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate mb-1" title={qr.name}>
          {qr.name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mb-4" title={qr.destination || qr.metadata?.ssid || finalPayload}>
          {qr.type === 'wifi'
            ? `SSID: ${qr.metadata?.ssid || 'WiFi'}`
            : qr.destination || finalPayload}
        </p>

        {/* Centered QR Canvas Box */}
        <div className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-4 group-hover:scale-105 transition-transform">
          <div ref={containerRef} className="rounded overflow-hidden shadow-sm" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs mb-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Total Scans</span>
            <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
              {qr.scanCount || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Last Scanned</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs truncate block">
              {qr.lastScannedAt ? new Date(qr.lastScannedAt).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
        <Link
          to={`/edit/${qr._id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 rounded-xl transition-all"
          title="Edit destination & details (QR image stays unchanged!)"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>

        <button
          onClick={() => onOpenDownload(qr)}
          className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
          title="Download PNG or SVG"
        >
          <Download className="w-4 h-4" />
        </button>

        <Link
          to={`/analytics?qrId=${qr._id}`}
          className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
          title="Scan Analytics"
        >
          <BarChart2 className="w-4 h-4" />
        </Link>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
          title="Copy Link"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onDuplicate && onDuplicate(qr._id)}
          className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors"
          title="Duplicate QR"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDeleteRequest(qr)}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
          title="Delete QR"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Download, Share2, Sparkles, Copy, Check, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const QRPreview = ({
  payload,
  customization,
  mode = 'dynamic',
  slug = '',
  name = 'Untitled QR',
  onOpenDownloadModal,
}) => {
  const containerRef = useRef(null);
  const qrCodeInstance = useRef(null);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Determine dots and gradient options
    const dotsOptions = {
      type: customization.dotsType || 'rounded',
      color: customization.fgColor || '#000000',
    };

    if (customization.gradient && customization.gradient.type === 'linear') {
      dotsOptions.gradient = {
        type: 'linear',
        rotation: (customization.gradient.rotation || 0) * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: customization.gradient.color1 || '#4f46e5' },
          { offset: 1, color: customization.gradient.color2 || '#06b6d4' },
        ],
      };
    }

    const options = {
      width: 260,
      height: 260,
      type: 'canvas',
      data: payload || 'https://qrflex.local',
      image: customization.logoUrl || undefined,
      dotsOptions,
      backgroundOptions: {
        color: customization.bgColor || '#ffffff',
      },
      cornersSquareOptions: {
        type: customization.cornersSquareType || 'extra-rounded',
        color: customization.cornersSquareColor || customization.fgColor || '#000000',
      },
      cornersDotOptions: {
        type: customization.cornersDotType || 'dot',
        color: customization.cornersDotColor || customization.fgColor || '#000000',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: customization.logoMargin ?? 5,
        imageSize: customization.logoSize ?? 0.22,
        hideBackgroundDots: true,
      },
      qrOptions: {
        errorCorrectionLevel: customization.errorCorrectionLevel || (customization.logoUrl ? 'H' : 'Q'),
      },
    };

    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeInstance.current.append(containerRef.current);
      }
    } else {
      qrCodeInstance.current.update(options);
    }
  }, [payload, customization]);

  const handleCopyLink = () => {
    if (payload) {
      navigator.clipboard.writeText(payload);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center sticky top-20">
      {/* Dynamic / Static Status Badge */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {mode === 'dynamic' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
              Dynamic QR Code
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Static QR Code
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-slate-400">Live Preview</span>
      </div>

      {/* QR Code Canvas Box */}
      <div
        className="p-4 rounded-2xl bg-white shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02]"
        style={{ width: '280px', height: '280px' }}
      >
        <div ref={containerRef} className="flex items-center justify-center overflow-hidden rounded-lg" />
      </div>

      {/* Details Box */}
      <div className="w-full mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Target Payload</span>
          {mode === 'dynamic' && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Editable Anytime</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate flex-1" title={payload}>
            {payload || 'No destination specified'}
          </p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          onClick={onOpenDownloadModal}
          className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download QR
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share Link
        </button>
      </div>
    </div>
  );
};

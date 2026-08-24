import React, { useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Modal } from '../common/Modal';
import { Download, FileImage, FileCode, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const QRDownloadModal = ({
  isOpen,
  onClose,
  payload,
  customization,
  qrName = 'qrcode',
}) => {
  const [format, setFormat] = useState('png'); // 'png' | 'svg'
  const [resolution, setResolution] = useState(1024); // 512, 1024, 2048
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    try {
      setDownloading(true);

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

      const qrCode = new QRCodeStyling({
        width: resolution,
        height: resolution,
        type: format === 'svg' ? 'svg' : 'canvas',
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
      });

      const cleanName = qrName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'qrcode';
      await qrCode.download({
        name: `${cleanName}_${resolution}px`,
        extension: format,
      });

      toast.success(`Exported ${cleanName}.${format} (${resolution}px) successfully!`);
      onClose();
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to generate export file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download High-Resolution QR Code">
      <div className="space-y-5">
        {/* Format Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('png')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                format === 'png'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                <FileImage className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">PNG Image</span>
                <span className="text-[10px] text-slate-500">Universal raster format</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('svg')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                format === 'svg'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-300">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">SVG Vector</span>
                <span className="text-[10px] text-slate-500">Infinite print resolution</span>
              </div>
            </button>
          </div>
        </div>

        {/* Resolution Selector (For PNG) */}
        {format === 'png' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Export Resolution
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { size: 512, label: 'Standard', desc: '512×512' },
                { size: 1024, label: 'High Res', desc: '1024×1024' },
                { size: 2048, label: 'Ultra Print', desc: '2048×2048' },
              ].map((r) => (
                <button
                  key={r.size}
                  type="button"
                  onClick={() => setResolution(r.size)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    resolution === r.size
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs block font-bold">{r.label}</span>
                  <span className="text-[10px] text-slate-500">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Rendering Image...' : `Download ${format.toUpperCase()} (${format === 'png' ? `${resolution}px` : 'Vector'})`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

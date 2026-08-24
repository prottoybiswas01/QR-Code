import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Save,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Info,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { QRFormInputs } from '../components/qr/QRFormInputs';
import { QRCustomizer } from '../components/qr/QRCustomizer';
import { QRPreview } from '../components/qr/QRPreview';
import { QRDownloadModal } from '../components/qr/QRDownloadModal';
import { FormSkeleton } from '../components/common/LoadingSkeleton';
import { buildQRPayload } from '../utils/qrPayloadBuilder';
import { useToast } from '../context/ToastContext';

export const EditQRPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [name, setName] = useState('');
  const [type, setType] = useState('url');
  const [mode, setMode] = useState('dynamic');
  const [destination, setDestination] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [metadata, setMetadata] = useState({});
  const [customization, setCustomization] = useState({});
  const [status, setStatus] = useState('active');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Fetch Existing QR Data
  const { data: qrData, isLoading, isError } = useQuery({
    queryKey: ['qrDetail', id],
    queryFn: () => qrService.getQRCodeById(id),
  });

  useEffect(() => {
    if (qrData?.data) {
      const q = qrData.data;
      setName(q.name || '');
      setType(q.type || 'url');
      setMode(q.mode || 'dynamic');
      setDestination(q.destination || '');
      setSlug(q.slug || '');
      setShortUrl(q.shortUrl || '');
      setMetadata(q.metadata || {});
      setCustomization(q.customization || {});
      setStatus(q.status || 'active');
    }
  }, [qrData]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (payload) => qrService.updateQRCode(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['userQRs'] });
      queryClient.invalidateQueries({ queryKey: ['qrDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      toast.success('QR Code updated! All existing printed codes will now route to your new destination.');
      navigate('/my-qrs');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update QR Code.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please specify a QR Code name.');
      return;
    }

    const payload = {
      name: name.trim(),
      type,
      destination,
      metadata,
      customization,
      status,
    };

    updateMutation.mutate(payload);
  };

  const previewPayload =
    mode === 'dynamic'
      ? shortUrl || `${window.location.origin}/q/${slug}`
      : buildQRPayload(type, 'static', destination, metadata);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <FormSkeleton />
      </div>
    );
  }

  if (isError || !qrData?.data) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code Not Found</h3>
        <p className="text-xs text-slate-500">The requested QR code does not exist or has been removed.</p>
        <Link to="/my-qrs" className="inline-block px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl">
          Back to My QR Codes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/my-qrs"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Edit QR Code: {name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update destination details in real-time without changing your physical prints
            </p>
          </div>
        </div>

        {mode === 'dynamic' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Permanent Slug Protected</span>
          </div>
        )}
      </div>

      {/* Dynamic Rule Alert Banner */}
      {mode === 'dynamic' && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <p className="font-bold">
              Dynamic Destination Update Active
            </p>
            <p className="leading-relaxed">
              When you update the destination URL, Wi-Fi password, or contact card below and click save, the permanent QR Code image remains unchanged. Any printed flyers, menus, or cards will immediately redirect to this new information.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editable Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Name & Status */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  QR Status
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white outline-none"
                >
                  <option value="active">Active (Serving Destination)</option>
                  <option value="paused">Paused (Temporarily Deactivated)</option>
                </select>
              </div>
            </div>

            {/* Type Specific Inputs */}
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

            {/* Visual Customizer */}
            <QRCustomizer
              customization={customization}
              setCustomization={setCustomization}
            />

            {/* Save Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? 'Saving Changes...' : 'Save & Update QR Code'}
              </button>
            </div>
          </div>

          {/* Right Column: Live Sticky Preview (5 cols) */}
          <div className="lg:col-span-5">
            <QRPreview
              payload={previewPayload}
              customization={customization}
              mode={mode}
              slug={slug}
              name={name}
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
        qrName={name}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QrCode,
  Sparkles,
  BarChart3,
  Wifi,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { StatCard } from '../components/dashboard/StatCard';
import { QRCard } from '../components/dashboard/QRCard';
import { CardSkeleton, StatCardSkeleton } from '../components/common/LoadingSkeleton';
import { QRDownloadModal } from '../components/qr/QRDownloadModal';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { buildQRPayload } from '../utils/qrPayloadBuilder';

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [downloadQR, setDownloadQR] = useState(null);
  const [deleteQRTarget, setDeleteQRTarget] = useState(null);

  // Fetch Dashboard Stats & Recent QRs
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => qrService.getDashboardOverview(),
  });

  // Fetch Recent User QRs
  const { data: qrcodesData, isLoading: qrsLoading } = useQuery({
    queryKey: ['userQRs', { limit: 6 }],
    queryFn: () => qrService.getQRCodes({ limit: 6 }),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => qrService.deleteQRCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQRs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      toast.success('QR Code deleted successfully.');
      setDeleteQRTarget(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete QR Code.');
    },
  });

  // Duplicate Mutation
  const duplicateMutation = useMutation({
    mutationFn: (id) => qrService.duplicateQRCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQRs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverview'] });
      toast.success('QR Code duplicated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to duplicate QR Code.');
    },
  });

  // Toggle Status Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      qrService.updateQRCode(id, { status: status === 'active' ? 'paused' : 'active' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQRs'] });
      toast.success('QR Code status updated.');
    },
  });

  const summary = overviewData?.data?.summary || {
    totalQRs: 0,
    dynamicQRs: 0,
    staticQRs: 0,
    totalScans: 0,
  };

  const recentQRs = qrcodesData?.data || [];

  return (
    <div className="space-y-8">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Dynamic QR Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manage & Track Your QR Fleet
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg">
            Update destinations, edit Wi-Fi passwords, customize colors, and monitor scan analytics in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <Link
            to="/create?type=dynamic"
            className="inline-flex items-center gap-2 py-3 px-5 text-xs font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            Create Dynamic QR
          </Link>
          <Link
            to="/create?type=wifi"
            className="inline-flex items-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl transition-all"
          >
            <Wifi className="w-4 h-4" />
            Wi-Fi QR
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {overviewLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total QR Codes"
              value={summary.totalQRs}
              icon={QrCode}
              color="indigo"
              subtitle="Active across all campaigns"
            />
            <StatCard
              title="Dynamic QRs"
              value={summary.dynamicQRs}
              icon={Sparkles}
              color="purple"
              subtitle="Editable destination URLs"
            />
            <StatCard
              title="Static QRs"
              value={summary.staticQRs}
              icon={Layers}
              color="sky"
              subtitle="Permanent hardcoded data"
            />
            <StatCard
              title="Total Scans"
              value={summary.totalScans}
              icon={BarChart3}
              color="emerald"
              subtitle="Across all active dynamic QRs"
            />
          </>
        )}
      </div>

      {/* Recent QR Codes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent QR Codes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quickly edit destinations or download high-res files
            </p>
          </div>
          <Link
            to="/my-qrs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all ({summary.totalQRs})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {qrsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentQRs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="max-w-sm mx-auto">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No QR Codes Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create your first Dynamic QR code to print once and update destination links anytime!
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create First QR Code
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentQRs.map((qr) => (
              <QRCard
                key={qr._id}
                qr={qr}
                onOpenDownload={(item) => setDownloadQR(item)}
                onDuplicate={(id) => duplicateMutation.mutate(id)}
                onDeleteRequest={(item) => setDeleteQRTarget(item)}
                onToggleStatus={(item) =>
                  toggleStatusMutation.mutate({ id: item._id, status: item.status })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Download Resolution Modal */}
      {downloadQR && (
        <QRDownloadModal
          isOpen={!!downloadQR}
          onClose={() => setDownloadQR(null)}
          payload={
            downloadQR.mode === 'dynamic'
              ? downloadQR.shortUrl || `${window.location.origin}/q/${downloadQR.slug}`
              : buildQRPayload(downloadQR.type, 'static', downloadQR.destination, downloadQR.metadata)
          }
          customization={downloadQR.customization || {}}
          qrName={downloadQR.name}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteQRTarget}
        onClose={() => setDeleteQRTarget(null)}
        title="Confirm QR Code Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete <strong>"{deleteQRTarget?.name}"</strong>?
          </p>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            ⚠️ <strong>Warning:</strong> Any physical flyers, posters, or materials printed with this Dynamic QR will immediately cease to function.
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteQRTarget(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteQRTarget._id)}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete QR'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

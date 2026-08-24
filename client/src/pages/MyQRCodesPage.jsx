import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QrCode,
  Search,
  Filter,
  Plus,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { QRCard } from '../components/dashboard/QRCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { QRDownloadModal } from '../components/qr/QRDownloadModal';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { buildQRPayload } from '../utils/qrPayloadBuilder';

export const MyQRCodesPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [downloadQR, setDownloadQR] = useState(null);
  const [deleteQRTarget, setDeleteQRTarget] = useState(null);

  // Fetch QR codes with query filters
  const { data: qrcodesData, isLoading } = useQuery({
    queryKey: ['userQRs', { search, type: typeFilter, mode: modeFilter, status: statusFilter, page, limit: 12 }],
    queryFn: () =>
      qrService.getQRCodes({
        search,
        type: typeFilter,
        mode: modeFilter,
        status: statusFilter,
        page,
        limit: 12,
      }),
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
      toast.success('Status updated.');
    },
  });

  const qrcodes = qrcodesData?.data || [];
  const pagination = qrcodesData?.pagination || { total: 0, page: 1, pages: 1 };

  return (
    <div className="space-y-6">
      {/* Title & Quick Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            My QR Codes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Search, filter, edit destinations, and download your QR assets
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New QR
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, destination URL, or SSID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="url">Website URL</option>
            <option value="wifi">Wi-Fi Network</option>
            <option value="vcard">vCard / Contact</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Plain Text</option>
            <option value="location">Location</option>
          </select>

          {/* Mode Filter */}
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
          >
            <option value="all">All Modes</option>
            <option value="dynamic">Dynamic Only</option>
            <option value="static">Static Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : qrcodes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
          <div className="max-w-xs mx-auto">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No QR Codes Found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search filters or generate a new QR Code.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 py-2 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create QR Code
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {qrcodes.map((qr) => (
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

      {/* Pagination Bar */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total items)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
        title="Delete QR Code"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete <strong>"{deleteQRTarget?.name}"</strong>?
          </p>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            This action cannot be undone. Any printed copies of this Dynamic QR will immediately stop resolving.
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
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

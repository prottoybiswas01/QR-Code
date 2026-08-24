import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  QrCode,
  Calendar,
  Layers,
} from 'lucide-react';
import { qrService } from '../services/qrService';
import { StatCard } from '../components/dashboard/StatCard';
import { StatCardSkeleton } from '../components/common/LoadingSkeleton';

export const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedQrId = searchParams.get('qrId') || 'all';
  const [period, setPeriod] = useState('30d');

  // Fetch list of user QRs for dropdown selector
  const { data: userQRsData } = useQuery({
    queryKey: ['userQRsList'],
    queryFn: () => qrService.getQRCodes({ limit: 50, mode: 'dynamic' }),
  });

  // Fetch either specific QR analytics or Dashboard overview
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', selectedQrId, period],
    queryFn: () => {
      if (selectedQrId && selectedQrId !== 'all') {
        return qrService.getQRAnalytics(selectedQrId, period);
      }
      return qrService.getDashboardOverview();
    },
  });

  const qrList = userQRsData?.data || [];
  const rawData = analyticsData?.data;

  // Aggregate Data calculation
  const timeSeries = rawData?.timeSeries || rawData?.scanTrends || [];
  const devices = rawData?.devices || [];
  const operatingSystems = rawData?.operatingSystems || [];
  const browsers = rawData?.browsers || [];
  const recentScans = rawData?.recentScans || [];

  const maxScanCount = Math.max(...timeSeries.map((t) => t.count || t.scans || 0), 1);

  return (
    <div className="space-y-6">
      {/* Header & QR Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Scan Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry on scan frequency, devices, and visitor operating systems
          </p>
        </div>

        {/* QR Selector & Period Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedQrId}
            onChange={(e) => setSearchParams({ qrId: e.target.value })}
            className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="all">📊 All Dynamic QR Codes (Fleet)</option>
            {qrList.map((q) => (
              <option key={q._id} value={q._id}>
                {q.name} ({q.type}) — {q.scanCount} scans
              </option>
            ))}
          </select>

          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  period === p
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Scan Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Daily Scan Activity Trend
            </h3>
            <span className="text-xs text-slate-500">Number of scans over selected period</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
            {period === '7d' ? 'Past 7 Days' : period === '30d' ? 'Past 30 Days' : 'Past 90 Days'}
          </span>
        </div>

        {/* CSS Bar Chart */}
        {timeSeries.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No scan logs recorded yet for this period.
          </div>
        ) : (
          <div className="h-60 pt-8 flex items-end justify-between gap-1 sm:gap-2 overflow-x-auto pb-4">
            {timeSeries.map((item, idx) => {
              const count = item.count || item.scans || 0;
              const heightPercent = Math.max(8, (count / maxScanCount) * 100);
              const label = item._id ? item._id.substring(5) : `Day ${idx + 1}`;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 min-w-[28px] group">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  {/* Bar */}
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-700 dark:to-indigo-500 transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                  {/* Date label */}
                  <span className="text-[9px] text-slate-400 rotate-45 sm:rotate-0 mt-1 font-mono">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Breakdowns Row (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Smartphone className="w-4 h-4 text-sky-500" />
            Device Categories
          </div>

          {devices.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No device data</p>
          ) : (
            <div className="space-y-3">
              {devices.map((d, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize text-slate-700 dark:text-slate-300">
                      {d._id || 'Mobile'}
                    </span>
                    <span className="font-bold">{d.count} scans</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (d.count / Math.max(1, devices.reduce((a, b) => a + b.count, 0))) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operating Systems */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Laptop className="w-4 h-4 text-purple-500" />
            Operating Systems
          </div>

          {operatingSystems.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No OS data</p>
          ) : (
            <div className="space-y-3">
              {operatingSystems.map((os, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{os._id}</span>
                    <span className="font-bold">{os.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (os.count /
                            Math.max(1, operatingSystems.reduce((a, b) => a + b.count, 0))) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browsers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Globe className="w-4 h-4 text-pink-500" />
            Top Browsers
          </div>

          {browsers.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No browser data</p>
          ) : (
            <div className="space-y-3">
              {browsers.map((b, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{b._id}</span>
                    <span className="font-bold">{b.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-pink-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (b.count / Math.max(1, browsers.reduce((a, b) => a + b.count, 0))) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Scan Logs Table (When specific QR is chosen) */}
      {recentScans.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Recent Scan Telemetry Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Device</th>
                  <th className="pb-3">OS</th>
                  <th className="pb-3">Browser</th>
                  <th className="pb-3">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentScans.map((log) => (
                  <tr key={log._id} className="text-slate-700 dark:text-slate-300">
                    <td className="py-2.5 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2.5 capitalize">{log.deviceType}</td>
                    <td className="py-2.5">{log.os}</td>
                    <td className="py-2.5">{log.browser}</td>
                    <td className="py-2.5">{log.country || 'Global'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

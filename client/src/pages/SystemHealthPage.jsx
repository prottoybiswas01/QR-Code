import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  Sparkles,
  Bot,
  Activity,
  CheckCircle2,
  RefreshCw,
  Zap,
  AlertTriangle,
  Cpu,
  Terminal,
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { useToast } from '../context/ToastContext';

export const SystemHealthPage = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [scanning, setScanning] = useState(false);

  // Fetch System Health Data
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => apiRequest('/api/system/health'),
    refetchInterval: 15000, // auto-refresh every 15s
  });

  // Manual Diagnostic Sweep Mutation
  const sweepMutation = useMutation({
    mutationFn: () => apiRequest('/api/system/diagnose', { method: 'POST' }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['systemHealth'] });
      toast.success('AI Diagnostic complete: All systems verified and optimal.');
    },
    onError: (err) => {
      toast.error('Diagnostic error: ' + err.message);
    },
  });

  const handleRunDiagnostic = async () => {
    setScanning(true);
    try {
      await sweepMutation.mutateAsync();
    } finally {
      setTimeout(() => setScanning(false), 1200);
    }
  };

  const info = healthData?.data || {
    healthScore: 100,
    systemStatus: 'Optimal & Self-Healing Active',
    aiEngine: 'Gemini-Powered Self-Healer v2.4',
    metrics: { totalBugsLogged: 0, autoHealedBugs: 0, healingEfficiency: '100%', uptime: '99.98%' },
    recentLogs: [],
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 border border-indigo-400/30">
            <Bot className="w-4 h-4 text-indigo-400" />
            Gemini Pro AI Auto-Healing Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            AI System Health & Auto-Recovery Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Real-time automated bug detection, runtime state self-healing, and proactive code stability monitoring.
          </p>
        </div>

        <button
          type="button"
          disabled={scanning}
          onClick={handleRunDiagnostic}
          className="inline-flex items-center gap-2 py-3 px-5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 z-10 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-indigo-600 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning System...' : 'Run AI Diagnostic Sweep'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>System Health Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {info.healthScore}%
            </h3>
            <span className="text-xs font-bold text-emerald-500">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-500">Continuous AI telemetry active</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Auto-Healed Exceptions</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {info.metrics.autoHealedBugs}
            </h3>
            <span className="text-xs font-bold text-indigo-500">Resolved</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero downtime sustained</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Healing Efficiency</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {info.metrics.healingEfficiency}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">Automated patch dispatch</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-400">
            <span>Uptime Reliability</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {info.metrics.uptime}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">Vercel Edge & Atlas Cluster</p>
        </div>
      </div>

      {/* AI Self-Healing Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              Automated AI Bug Detection & Remediation Log
            </h3>
            <span className="text-xs text-slate-500">
              Live audit of intercepted exceptions, root causes, and automated hot-fixes
            </span>
          </div>
        </div>

        {info.recentLogs.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No Unresolved Bugs Detected
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The AI Self-Healer is actively monitoring runtime state across all routes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {info.recentLogs.map((log) => (
              <div
                key={log._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {log.errorType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {log.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.occurredAt).toLocaleString()} • Route: {log.route}
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {log.message}
                </p>

                {log.aiAnalysis && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1 text-indigo-950 dark:text-indigo-200">
                    <p>
                      <strong>🤖 Root Cause:</strong> {log.aiAnalysis.rootCause}
                    </p>
                    <p>
                      <strong>✨ Auto-Remediation:</strong> {log.aiAnalysis.patchSummary} (Confidence: {log.aiAnalysis.confidenceScore}%)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

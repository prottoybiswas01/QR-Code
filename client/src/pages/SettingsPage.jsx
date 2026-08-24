import React from 'react';
import { Shield, Sparkles, Database, Key, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Security parameters, plan quotas, and dynamic redirection configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Plan Quotas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Active Plan & Usage Quotas
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Plan Tier</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase">
                {profile?.user?.plan || 'Free'}
              </p>
              <span className="text-[11px] text-slate-500">Unlimited destination edits</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Dynamic QRs Limit</span>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                {profile?.user?.limits?.maxDynamicQRs || 25}
              </p>
              <span className="text-[11px] text-slate-500">Permanent short slugs</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total QR Codes</span>
              <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                {profile?.user?.limits?.maxQRs || 50}
              </p>
              <span className="text-[11px] text-slate-500">Static + Dynamic combined</span>
            </div>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Shield className="w-5 h-5 text-emerald-500" />
            Security & Authentication
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 dark:text-emerald-200 block">
                  Firebase Authentication Engine
                </span>
                <span>
                  Passwords are encrypted and verified directly through Google Firebase infrastructure. No plain-text passwords exist in MongoDB.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-950 dark:text-indigo-200 block">
                  Ownership & Slug Isolation
                </span>
                <span>
                  Only the verified owner of a QR code can modify its destination. Dynamic slug lookups are protected against brute-force attacks via API rate limiters.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

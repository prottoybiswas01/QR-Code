import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, Home, QrCode } from 'lucide-react';

export const DisabledQRPage = () => {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug') || '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            QR Code Temporarily Inactive
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This QR code campaign has been paused or deactivated by its owner. Please check back later or contact the owner.
          </p>
          {slug && (
            <span className="inline-block mt-2 font-mono text-[10px] text-slate-400">
              Identifier: {slug}
            </span>
          )}
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Visit Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

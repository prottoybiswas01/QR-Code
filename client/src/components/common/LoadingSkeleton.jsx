import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
    </div>
    <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
    <div className="w-1/2 h-4 bg-slate-100 dark:bg-slate-800/60 rounded mb-4"></div>
    <div className="w-full h-32 bg-slate-100 dark:bg-slate-800/40 rounded-xl mb-4"></div>
    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
    </div>
    <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
    <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
  </div>
);

export const FormSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-5">
    <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
    <div className="w-full h-11 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
    <div className="w-full h-11 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
    <div className="w-full h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
    <div className="w-36 h-11 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
  </div>
);

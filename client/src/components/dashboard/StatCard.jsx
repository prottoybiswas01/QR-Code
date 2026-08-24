import React from 'react';

export const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive', subtitle, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/60',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-900/60',
    sky: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-900/60',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/60',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[color] || colorMap.indigo}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {change && (
          <span
            className={`text-xs font-bold ${
              changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

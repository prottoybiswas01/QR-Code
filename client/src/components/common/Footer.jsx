import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, Zap, Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                QRFlex
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The modern dynamic QR code generation platform. Print your QR once and change destinations forever.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Systems Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/create?type=dynamic" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dynamic URL QRs</Link></li>
              <li><Link to="/create?type=wifi" className="hover:text-indigo-600 dark:hover:text-indigo-400">Dynamic Wi-Fi Portals</Link></li>
              <li><Link to="/create?type=vcard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Digital Business Cards</Link></li>
              <li><Link to="/create?type=whatsapp" className="hover:text-indigo-600 dark:hover:text-indigo-400">WhatsApp & Social QRs</Link></li>
              <li><Link to="/analytics" className="hover:text-indigo-600 dark:hover:text-indigo-400">Scan Analytics</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="/#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400">Free Tier</a></li>
              <li><a href="/#dynamic-qr" className="hover:text-indigo-600 dark:hover:text-indigo-400">How Dynamic QR Works</a></li>
              <li><a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">FAQ & Help</a></li>
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Create Free Account</Link></li>
            </ul>
          </div>

          {/* Security & Reliability */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Security & Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade privacy with Firebase Authentication, zero plain-text password storage, and anonymized scan analytics.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <Shield className="w-4 h-4 text-emerald-500" />
                Permanent Link Integrity
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your dynamic slugs never change, ensuring zero broken links on physical prints.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} QRFlex. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for high-performance Dynamic QR solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

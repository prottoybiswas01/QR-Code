import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Sparkles,
  Wifi,
  Globe,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  RefreshCw,
  Layers,
  ChevronDown,
  CheckCircle2,
  Check,
  Share2,
  Download,
  Smartphone,
  Eye,
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { QRPreview } from '../components/qr/QRPreview';
import { QRDownloadModal } from '../components/qr/QRDownloadModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { user } = useAuth();
  const [demoType, setDemoType] = useState('wifi'); // 'wifi' | 'url'
  const [demoUrl, setDemoUrl] = useState('https://facebook.com/mybusiness');
  const [wifiSsid, setWifiSsid] = useState('Guest_WiFi_5G');
  const [wifiPass, setWifiPass] = useState('SecretCoffee2026');
  const [openFaq, setOpenFaq] = useState(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const demoCustomization = {
    fgColor: '#4f46e5',
    bgColor: '#ffffff',
    gradient: { type: 'linear', color1: '#4f46e5', color2: '#06b6d4', rotation: 45 },
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    errorCorrectionLevel: 'Q',
  };

  const demoPayload =
    demoType === 'wifi'
      ? `${window.location.origin}/q/demo-wifi-guest`
      : `${window.location.origin}/q/demo-brand-page`;

  const faqs = [
    {
      q: 'What is a Dynamic QR Code and how is it different from a Static QR?',
      a: 'A Static QR code permanently embeds your destination data directly into the black-and-white pixels. Once printed, it can never be changed. A Dynamic QR code embeds a permanent short URL (e.g. yourdomain.com/q/8f73ab21) that forwards scanners to your desired destination. You can change the destination URL, Wi-Fi password, or contact card inside your dashboard anytime without reprinting your posters, menus, or cards!',
    },
    {
      q: 'Can I change my Wi-Fi password without printing a new QR code?',
      a: 'Yes! That is our primary innovation. When you generate a Dynamic Wi-Fi QR, it links to your dedicated mobile Wi-Fi portal. When you change the router password, simply update it in your QRFlex dashboard. Customers scanning the existing printed QR code will instantly see and copy the new password.',
    },
    {
      q: 'Is QRFlex free to use?',
      a: 'Yes! Our generous Free Plan allows you to create up to 50 QR codes (including 25 Dynamic QR codes) with unlimited destination edits and basic scan statistics forever.',
    },
    {
      q: 'What export formats are available for printing?',
      a: 'You can download your custom QR codes in high-resolution PNG (up to 2048x2048 Ultra HD) or scalable vector SVG format, perfect for business cards, banners, restaurant tables, and packaging.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline & Value Prop */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Next-Generation Dynamic QR Engine</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  Print Once.{' '}
                  <span className="gradient-text">Change Destination</span> Forever.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Create high-performance <strong>Dynamic QR Codes</strong> for websites, Wi-Fi networks, vCards, and social campaigns. Update destination URLs or passwords anytime from your dashboard without reprinting.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    to={user ? '/dashboard' : '/register'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{user ? 'Open Dashboard' : 'Create Free QR Code'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/create"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all"
                  >
                    <QrCode className="w-5 h-5 text-indigo-500" />
                    <span>Try Generator Live</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>100% Free Tier</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>High-Res PNG & SVG Export</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Live Hero Demo */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative border-shine">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Interactive Live Demo
                    </span>
                  </div>

                  {/* Mode switch */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setDemoType('wifi')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        demoType === 'wifi'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      Dynamic Wi-Fi
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoType('url')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        demoType === 'url'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Dynamic URL
                    </button>
                  </div>

                  {/* Interactive inputs in hero */}
                  {demoType === 'wifi' ? (
                    <div className="space-y-2.5 mb-4">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Network Name (SSID)</label>
                        <input
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-500 block mb-1">Wi-Fi Password (Change anytime!)</label>
                        <input
                          type="text"
                          value={wifiPass}
                          onChange={(e) => setWifiPass(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none font-mono"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 mb-4">
                      <label className="text-[11px] font-semibold text-slate-500 block">Destination URL</label>
                      <input
                        type="url"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
                      />
                    </div>
                  )}

                  {/* QR Preview Instance */}
                  <QRPreview
                    payload={demoPayload}
                    customization={demoCustomization}
                    mode="dynamic"
                    slug="demo-sample"
                    onOpenDownloadModal={() => setDownloadModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC QR CONCEPT SECTION */}
        <section id="dynamic-qr" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Core Innovation
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                How Dynamic QR Architecture Works
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Physical printing is expensive and irreversible. Dynamic QR solves this by decoupling the permanent printed image from the real-time cloud destination.
              </p>
            </div>

            {/* Workflow cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg mb-5">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Generate Stable Permanent Identifier
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your QR is assigned a permanent unique short URL like <code className="text-indigo-600 font-mono">/q/8f73ab21</code>. This identifier never changes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm relative">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-lg mb-5">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Print & Place Anywhere
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Export vector SVG or 2048px PNG and print on restaurant tables, flyers, business cards, merchandise, or product packaging.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-sm relative">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-black text-lg mb-5">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Update Destination at Will
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Change promo links, social profiles, or Wi-Fi passwords inside your dashboard in 5 seconds. All existing printed codes instantly route to the new target.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                SaaS Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Everything You Need to Manage QR Codes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Wifi,
                  title: 'Dynamic Wi-Fi Portals',
                  desc: 'Host mobile-optimized Wi-Fi portals with 1-click password copy and step-by-step connection guides.',
                  color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
                },
                {
                  icon: BarChart3,
                  title: 'Real-time Scan Telemetry',
                  desc: 'Track scan counts, mobile vs desktop breakdown, browser types, and timestamp distributions.',
                  color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
                },
                {
                  icon: Shield,
                  title: 'Secure Firebase & MongoDB',
                  desc: 'Zero plain-text password storage. Powered by Google Firebase Authentication and scalable MongoDB indexing.',
                  color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
                },
                {
                  icon: Sparkles,
                  title: 'Custom Brand Styling',
                  desc: 'Linear gradients, custom dot patterns, corner shapes, center logo embedding, and error correction tuning.',
                  color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
                },
                {
                  icon: Download,
                  title: 'Ultra High-Res Export',
                  desc: 'Download crisp raster PNG up to 2048px or scalable vector SVG files for infinite print crispness.',
                  color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/60',
                },
                {
                  icon: RefreshCw,
                  title: '11 Specialized Formats',
                  desc: 'Website URLs, Wi-Fi, vCard, WhatsApp, Facebook, Instagram, Email, Phone, SMS, Plain Text, and Maps.',
                  color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRICING / FREE PLAN */}
        <section id="pricing" className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Start 100% Free. Upgrade Anytime.
              </h2>
            </div>

            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-6 rounded-bl-xl">
                Always Free
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Community Starter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Perfect for individuals, local shops, and small businesses.
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>50 Total QR Codes</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>25 Dynamic QR Codes</strong> with permanent URLs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Unlimited Destination Updates</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Dynamic Wi-Fi Portals & vCards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>High-Res PNG (2048px) & Vector SVG Downloads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Scan Analytics & Device Breakdown</span>
                </li>
              </ul>

              <Link
                to={user ? '/dashboard' : '/register'}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{user ? 'Open Dashboard' : 'Get Started for Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Got Questions?
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Upgrade Your QR Strategy?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
              Join thousands of creators, businesses, and venues who never reprint QR codes again.
            </p>
            <div className="pt-2">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-8 py-4 font-black text-indigo-900 bg-white hover:bg-slate-100 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-base"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span>Create Your Dynamic QR Now</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Download Modal for live demo */}
      <QRDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        payload={demoPayload}
        customization={demoCustomization}
        qrName="demo_qr"
      />
    </div>
  );
};

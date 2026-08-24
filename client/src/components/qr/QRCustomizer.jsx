import React, { useState } from 'react';
import { Palette, Layers, Sparkles, Image, Shield, ChevronDown, ChevronUp, Upload, Trash2 } from 'lucide-react';

const COLOR_PRESETS = [
  '#000000',
  '#4f46e5',
  '#0284c7',
  '#059669',
  '#dc2626',
  '#7c3aed',
  '#db2777',
  '#d97706',
];

const GRADIENT_PRESETS = [
  { name: 'Indigo Dream', color1: '#4f46e5', color2: '#06b6d4', rotation: 45 },
  { name: 'Sunset Glow', color1: '#f43f5e', color2: '#fb923c', rotation: 45 },
  { name: 'Emerald Forest', color1: '#059669', color2: '#10b981', rotation: 90 },
  { name: 'Neon Purple', color1: '#7c3aed', color2: '#ec4899', rotation: 135 },
  { name: 'Cyber Blue', color1: '#2563eb', color2: '#38bdf8', rotation: 45 },
];

export const QRCustomizer = ({ customization, setCustomization }) => {
  const [activeTab, setActiveTab] = useState('colors'); // 'colors' | 'shapes' | 'logo' | 'security'

  const updateCust = (key, val) => {
    setCustomization((prev) => ({ ...prev, [key]: val }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCust('logoUrl', event.target.result);
        // Automatically switch error correction to High for reliable scanning with logo
        updateCust('errorCorrectionLevel', 'H');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          QR Design & Customization
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'colors'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Colors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'shapes'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Shapes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'logo'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Logo
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Quality
        </button>
      </div>

      {/* Tab 1: Colors & Gradients */}
      {activeTab === 'colors' && (
        <div className="space-y-4 pt-1">
          {/* Gradient toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Color Style
            </span>
            <div className="flex gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => updateCust('gradient', { ...(customization.gradient || {}), type: 'none' })}
                className={`px-2.5 py-1 rounded-lg border ${
                  customization.gradient?.type === 'none'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => updateCust('gradient', { ...(customization.gradient || {}), type: 'linear' })}
                className={`px-2.5 py-1 rounded-lg border ${
                  customization.gradient?.type === 'linear'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Gradient
              </button>
            </div>
          </div>

          {customization.gradient?.type === 'linear' ? (
            <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gradient Presets
              </span>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((gp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      updateCust('gradient', {
                        type: 'linear',
                        color1: gp.color1,
                        color2: gp.color2,
                        rotation: gp.rotation,
                      })
                    }
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-left hover:scale-105 transition-transform"
                  >
                    <div
                      className="w-full h-4 rounded mb-1"
                      style={{
                        background: `linear-gradient(${gp.rotation}deg, ${gp.color1}, ${gp.color2})`,
                      }}
                    />
                    <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 block truncate">
                      {gp.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Color 1</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.gradient?.color1 || '#4f46e5'}
                      onChange={(e) =>
                        updateCust('gradient', { ...customization.gradient, color1: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customization.gradient?.color1 || '#4f46e5'}
                      onChange={(e) =>
                        updateCust('gradient', { ...customization.gradient, color1: e.target.value })
                      }
                      className="w-full px-2 py-1 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Color 2</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.gradient?.color2 || '#06b6d4'}
                      onChange={(e) =>
                        updateCust('gradient', { ...customization.gradient, color2: e.target.value })
                      }
                      className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={customization.gradient?.color2 || '#06b6d4'}
                      onChange={(e) =>
                        updateCust('gradient', { ...customization.gradient, color2: e.target.value })
                      }
                      className="w-full px-2 py-1 text-xs border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Foreground Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="color"
                    value={customization.fgColor || '#000000'}
                    onChange={(e) => updateCust('fgColor', e.target.value)}
                    className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                  />
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateCust('fgColor', color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        customization.fgColor === color ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background Color */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.bgColor || '#ffffff'}
                onChange={(e) => updateCust('bgColor', e.target.value)}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer p-0 bg-transparent"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateCust('bgColor', '#ffffff')}
                  className="px-3 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => updateCust('bgColor', '#f8fafc')}
                  className="px-3 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Slate Light
                </button>
                <button
                  type="button"
                  onClick={() => updateCust('bgColor', '#0f172a')}
                  className="px-3 py-1 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-900 text-white"
                >
                  Dark Slate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Shapes & Patterns */}
      {activeTab === 'shapes' && (
        <div className="space-y-4 pt-1">
          {/* Dots Pattern */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              QR Body Pattern
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rounded', label: 'Rounded' },
                { id: 'dots', label: 'Dots' },
                { id: 'classy', label: 'Classy' },
                { id: 'classy-rounded', label: 'Classy Round' },
                { id: 'extra-rounded', label: 'Smooth' },
                { id: 'square', label: 'Standard' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateCust('dotsType', style.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    customization.dotsType === style.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Square */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Corner Outer Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'extra-rounded', label: 'Curved' },
                { id: 'dot', label: 'Circle' },
                { id: 'square', label: 'Square' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateCust('cornersSquareType', c.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    customization.cornersSquareType === c.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Dot */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Corner Inner Eye
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dot', label: 'Circle Dot' },
                { id: 'square', label: 'Square Dot' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => updateCust('cornersDotType', c.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    customization.cornersDotType === c.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logo Center Embedding */}
      {activeTab === 'logo' && (
        <div className="space-y-4 pt-1">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Upload your company logo, app icon, or custom image to place in the center of the QR code.
          </p>

          {customization.logoUrl ? (
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <img
                src={customization.logoUrl}
                alt="Selected Logo"
                className="w-12 h-12 object-contain bg-white rounded-lg p-1 border shadow-sm"
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Custom Logo Active
                </span>
                <span className="text-[10px] text-slate-500">Error Correction set to High (H)</span>
              </div>
              <button
                type="button"
                onClick={() => updateCust('logoUrl', '')}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                title="Remove logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all">
              <Upload className="w-8 h-8 text-indigo-500 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to upload logo
              </span>
              <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, SVG up to 2MB</span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          )}

          {customization.logoUrl && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Logo Margin / Padding</span>
                  <span>{customization.logoMargin || 5}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={customization.logoMargin ?? 5}
                  onChange={(e) => updateCust('logoMargin', parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Error Correction & Scan Quality */}
      {activeTab === 'security' && (
        <div className="space-y-3 pt-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Error Correction Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { level: 'L', name: 'Low (7%)', desc: 'Best for clean backgrounds & dense data' },
              { level: 'M', name: 'Medium (15%)', desc: 'Standard balance for most screens' },
              { level: 'Q', name: 'Quartile (25%)', desc: 'Great for printed posters & cards' },
              { level: 'H', name: 'High (30%)', desc: 'Required when logos or overlays are used' },
            ].map((ec) => (
              <button
                key={ec.level}
                type="button"
                onClick={() => updateCust('errorCorrectionLevel', ec.level)}
                className={`p-2.5 text-left rounded-xl border transition-all ${
                  customization.errorCorrectionLevel === ec.level
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{ec.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {ec.level}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">{ec.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Download,
  Check,
  Smartphone,
  Sparkles,
  Palette,
  CheckCircle2,
  Camera,
  Phone,
  MessageCircle,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { BRAND_ICON_SAMPLES, BrandIconSample } from '../../data/brandIconsData.ts';
import { LogoIconGlyph } from '../common/Logo.tsx';

export const BrandIconStudioModal: React.FC = () => {
  const {
    openBrandStudioModal,
    setOpenBrandStudioModal,
    activeLogoPreset,
    setActiveLogoPreset,
    addNotification,
  } = useApp();

  const [studioTab, setStudioTab] = useState<'icons' | 'logos'>('icons');
  const [selectedIcon, setSelectedIcon] = useState<BrandIconSample>(BRAND_ICON_SAMPLES[0]);
  const [iconShape, setIconShape] = useState<'squircle' | 'circle' | 'rounded'>('squircle');
  const [wallpaper, setWallpaper] = useState<'cosmic' | 'saffron' | 'light'>('cosmic');
  const [homeLabel, setHomeLabel] = useState<'12Rashi' | '12Rashi Astrology'>('12Rashi');
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  if (!openBrandStudioModal) return null;

  const shapeClass =
    iconShape === 'circle'
      ? 'rounded-full'
      : iconShape === 'rounded'
      ? 'rounded-xl'
      : 'rounded-[22%]';

  const wallpaperBg =
    wallpaper === 'cosmic'
      ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-950 text-white'
      : wallpaper === 'saffron'
      ? 'bg-gradient-to-br from-orange-900 via-amber-800 to-stone-950 text-white'
      : 'bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 text-stone-900';

  const drawVectorIconToCanvas = (
    ctx: CanvasRenderingContext2D,
    presetId: string,
    size: number
  ) => {
    const cx = size / 2;
    const cy = size / 2;

    if (presetId === 'obsidian-kundli') {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#1C1917');
      grad.addColorStop(1, '#0C0A09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const gold = ctx.createLinearGradient(0, 0, size, size);
      gold.addColorStop(0, '#FEF08A');
      gold.addColorStop(0.5, '#F59E0B');
      gold.addColorStop(1, '#EA580C');

      const pad = size * 0.16;
      const box = size - pad * 2;
      ctx.strokeStyle = gold;
      ctx.lineWidth = size * 0.02;
      ctx.strokeRect(pad, pad, box, box);

      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(size - pad, size - pad);
      ctx.moveTo(size - pad, pad);
      ctx.lineTo(pad, size - pad);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, pad);
      ctx.lineTo(size - pad, cy);
      ctx.lineTo(cx, size - pad);
      ctx.lineTo(pad, cy);
      ctx.closePath();
      ctx.strokeStyle = '#FDE047';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#1C1917';
      ctx.fill();
      ctx.strokeStyle = '#FBBF24';
      ctx.stroke();

      ctx.fillStyle = '#FDE047';
      ctx.font = `900 ${Math.round(size * 0.14)}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('12', cx, cy + size * 0.01);
      return;
    }

    // default-chakra
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#FFF7ED');
    bgGrad.addColorStop(1, '#FFEDD5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    const discGrad = ctx.createLinearGradient(0, 0, size, size);
    discGrad.addColorStop(0, '#FB923C');
    discGrad.addColorStop(0.5, '#F97316');
    discGrad.addColorStop(1, '#EA580C');

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
    ctx.fillStyle = discGrad;
    ctx.fill();

    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = size * 0.014;
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.24 * Math.cos(a), cy + size * 0.24 * Math.sin(a));
      ctx.lineTo(cx + size * 0.39 * Math.cos(a), cy + size * 0.39 * Math.sin(a));
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.21, 0, Math.PI * 2);
    ctx.fillStyle = '#C2410C';
    ctx.fill();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = size * 0.018;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();

    ctx.fillStyle = '#7C2D12';
    ctx.font = `900 ${Math.round(size * 0.14)}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('12', cx, cy + size * 0.01);
  };

  const handleDownloadIconPng = async (sample: BrandIconSample, size = 512) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply shape clip if rounded/circle/squircle requested
    const radius =
      iconShape === 'circle'
        ? size / 2
        : iconShape === 'rounded'
        ? size * 0.12
        : size * 0.22;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.clip();

    if (sample.imageSrc) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = sample.imageSrc!;
      });
    } else {
      drawVectorIconToCanvas(ctx, sample.id, size);
    }

    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `12rashi-app-icon-${sample.id}-${size}px.png`;
    link.click();

    setDownloadedId(`${sample.id}-${size}`);
    setTimeout(() => setDownloadedId(null), 2000);
    addNotification(
      'App Icon Downloaded',
      `Exported "${sample.name}" (${size}×${size} PNG) for Home Screen / Play Store.`,
      'astrologer'
    );
  };

  const handleDownloadLogoLockup = async (
    variantName: string,
    sample: BrandIconSample,
    theme: 'light' | 'dark' | 'saffron'
  ) => {
    const width = 1200;
    const height = 360;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (theme === 'dark') {
      ctx.fillStyle = '#111827';
    } else if (theme === 'saffron') {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, '#EA580C');
      g.addColorStop(1, '#B45309');
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = '#FFFBEB';
    }
    ctx.fillRect(0, 0, width, height);

    // Draw Emblem on left
    const emblemSize = 220;
    const emblemX = 70;
    const emblemY = 70;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(emblemX, emblemY, emblemSize, emblemSize, 48);
    ctx.clip();
    if (sample.imageSrc) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, emblemX, emblemY, emblemSize, emblemSize);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = sample.imageSrc!;
      });
    } else {
      ctx.translate(emblemX, emblemY);
      drawVectorIconToCanvas(ctx, sample.id, emblemSize);
      ctx.translate(-emblemX, -emblemY);
    }
    ctx.restore();

    // Brand Title
    const textX = 330;
    ctx.fillStyle = theme === 'light' ? '#1C1917' : '#FFFFFF';
    ctx.font = '800 76px Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('12Rashi Astrology', textX, 145);

    ctx.fillStyle = theme === 'light' ? '#C2410C' : '#FDE68A';
    ctx.font = '700 24px system-ui, sans-serif';
    ctx.fillText('VEDIC JYOTISH, KUNDLI & LIVE CONSULTATIONS', textX, 212);

    ctx.fillStyle = theme === 'light' ? '#78716C' : '#D6D3D1';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText('Sole Proprietorship: 12rashi Infotech  •  Legal Name: Basudeo Shah', textX, 256);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `12rashi-astrology-logo-${variantName}.png`;
    link.click();

    setDownloadedId(variantName);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  const applyAsActiveLogo = (sample: BrandIconSample) => {
    setActiveLogoPreset(sample.id);
    addNotification(
      'Navbar Logo Updated',
      `Applied "${sample.name}" as your active 12Rashi Astrology logo.`,
      'astrologer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 border border-orange-200 dark:border-stone-800 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-orange-950 text-white px-5 py-4 flex items-center justify-between border-b border-stone-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-amber-400/40 flex items-center justify-center">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-extrabold tracking-tight flex items-center gap-2">
                <span>12Rashi Astrology — App Icon & Brand Logo Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 font-sans uppercase">
                  6 Concepts
                </span>
              </h2>
              <p className="text-[11px] text-stone-300">
                Preview multiple home screen app icons & logo lockups • 12rashi Infotech (Basudeo Shah)
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpenBrandStudioModal(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer transition"
            aria-label="Close Brand Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-stone-50 dark:bg-stone-950 px-5 pt-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setStudioTab('icons')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl flex items-center gap-1.5 cursor-pointer transition ${
                studioTab === 'icons'
                  ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Home Screen App Icons (6 Samples)</span>
            </button>
            <button
              onClick={() => setStudioTab('logos')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl flex items-center gap-1.5 cursor-pointer transition ${
                studioTab === 'logos'
                  ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brand Logos & Wordmark Lockups (6 Samples)</span>
            </button>
          </div>

          {activeLogoPreset !== 'default-chakra' && (
            <button
              onClick={() => setActiveLogoPreset('default-chakra')}
              className="mb-2 text-[11px] font-bold text-stone-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Navbar Logo to Default</span>
            </button>
          )}
        </div>

        {/* Scrollable Studio Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {studioTab === 'icons' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Live Phone Home Screen Simulator */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Live Phone Home Screen
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
                    {selectedIcon.name}
                  </span>
                </div>

                {/* Mockup Frame */}
                <div className="mx-auto max-w-[270px] rounded-[2.2rem] p-2.5 bg-stone-900 border-[4px] border-stone-700 shadow-2xl">
                  <div className={`rounded-[1.7rem] p-4 min-h-[380px] flex flex-col justify-between relative overflow-hidden ${wallpaperBg}`}>
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-[10px] font-bold opacity-80 px-1">
                      <span>9:41</span>
                      <div className="w-14 h-3 rounded-full bg-black/50" />
                      <span>5G 100%</span>
                    </div>

                    {/* Widget */}
                    <div className="my-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                      <div className="text-[9px] uppercase tracking-widest opacity-75">Daily Panchang</div>
                      <div className="text-xs font-bold mt-0.5">Shubh Muhurat • Abhijit</div>
                      <div className="text-[10px] opacity-80">12:04 PM – 12:52 PM</div>
                    </div>

                    {/* App Icon Grid */}
                    <div className="grid grid-cols-4 gap-3 my-2">
                      {/* Sample App Slot (Highlighted) */}
                      <div className="flex flex-col items-center gap-1 col-span-1">
                        <div className={`w-13 h-13 overflow-hidden shadow-lg ring-2 ring-amber-400/80 ${shapeClass}`}>
                          {selectedIcon.imageSrc ? (
                            <img
                              src={selectedIcon.imageSrc}
                              alt={selectedIcon.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <LogoIconGlyph presetId={selectedIcon.id} size={52} className="w-full h-full !rounded-none" />
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-center leading-tight line-clamp-1">
                          {homeLabel}
                        </span>
                      </div>

                      {/* Mock Neighbor System Apps */}
                      {[
                        { label: 'Phone', bg: 'bg-emerald-500', Icon: Phone },
                        { label: 'WhatsApp', bg: 'bg-green-600', Icon: MessageCircle },
                        { label: 'Camera', bg: 'bg-stone-600', Icon: Camera },
                        { label: 'Compass', bg: 'bg-sky-600', Icon: Compass },
                        { label: 'Horoscope', bg: 'bg-purple-600', Icon: Sparkles },
                      ].map((app) => {
                        const AppIc = app.Icon;
                        return (
                          <div key={app.label} className="flex flex-col items-center gap-1 opacity-75">
                            <div className={`w-13 h-13 ${app.bg} text-white flex items-center justify-center shadow ${shapeClass}`}>
                              <AppIc className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] text-center opacity-85">{app.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dock Bar */}
                    <div className="mt-4 px-3 py-2 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-around">
                      <Phone className="w-4 h-4 opacity-90" />
                      <MessageCircle className="w-4 h-4 opacity-90" />
                      <div className={`w-8 h-8 overflow-hidden shadow ${shapeClass}`}>
                        {selectedIcon.imageSrc ? (
                          <img
                            src={selectedIcon.imageSrc}
                            alt={selectedIcon.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LogoIconGlyph presetId={selectedIcon.id} size={32} className="w-full h-full !rounded-none" />
                        )}
                      </div>
                      <Camera className="w-4 h-4 opacity-90" />
                    </div>
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="bg-stone-50 dark:bg-stone-800/70 rounded-2xl p-3 border border-stone-200 dark:border-stone-700 space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-600 dark:text-stone-300">Icon Shape:</span>
                    <div className="flex gap-1">
                      {(['squircle', 'rounded', 'circle'] as const).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setIconShape(shape)}
                          className={`px-2 py-1 rounded-md capitalize font-bold cursor-pointer ${
                            iconShape === shape
                              ? 'bg-orange-600 text-white'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-600 dark:text-stone-300">Wallpaper:</span>
                    <div className="flex gap-1">
                      {(['cosmic', 'saffron', 'light'] as const).map((wp) => (
                        <button
                          key={wp}
                          onClick={() => setWallpaper(wp)}
                          className={`px-2 py-1 rounded-md capitalize font-bold cursor-pointer ${
                            wallpaper === wp
                              ? 'bg-orange-600 text-white'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {wp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-600 dark:text-stone-300">Label:</span>
                    <div className="flex gap-1">
                      {(['12Rashi', '12Rashi Astrology'] as const).map((lbl) => (
                        <button
                          key={lbl}
                          onClick={() => setHomeLabel(lbl)}
                          className={`px-2 py-1 rounded-md font-bold cursor-pointer ${
                            homeLabel === lbl
                              ? 'bg-orange-600 text-white'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: 6 Sample Icon Cards */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRAND_ICON_SAMPLES.map((sample) => {
                  const isSelected = selectedIcon.id === sample.id;
                  const isActiveLogo = activeLogoPreset === sample.id;

                  return (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedIcon(sample)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/20 shadow-md ring-1 ring-orange-500/40'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-16 h-16 shrink-0 overflow-hidden shadow-md border border-amber-300/40 ${shapeClass}`}>
                          {sample.imageSrc ? (
                            <img
                              src={sample.imageSrc}
                              alt={sample.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <LogoIconGlyph presetId={sample.id} size={64} className="w-full h-full !rounded-none" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                              {sample.styleTag}
                            </span>
                            {isActiveLogo && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Active Logo
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate mt-0.5">
                            {sample.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">{sample.subtitle}</p>

                          <div className="flex items-center gap-1 mt-1.5">
                            {sample.palette.map((hex) => (
                              <span
                                key={hex}
                                className="w-3.5 h-3.5 rounded-full border border-black/15"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                            <span className="text-[10px] text-stone-400 ml-1 truncate">{sample.bestFor}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                        {sample.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/70 dark:border-stone-800">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            applyAsActiveLogo(sample);
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition ${
                            isActiveLogo
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-900 dark:bg-stone-800 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {isActiveLogo ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                          <span>{isActiveLogo ? 'Active in Header' : 'Use as Header Logo'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadIconPng(sample, 512);
                          }}
                          className="py-1.5 px-2.5 rounded-lg text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 flex items-center gap-1 cursor-pointer transition"
                          title="Download 512x512 PNG for Play Store / Home Screen"
                        >
                          {downloadedId === `${sample.id}-512` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          <span>512px PNG</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadIconPng(sample, 192);
                          }}
                          className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer transition"
                          title="Download 192x192 PWA Home Screen Icon"
                        >
                          <span>192px</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB 2: Brand Logo Lockups */
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <strong className="text-stone-900 dark:text-white">Brand Identity Lockups:</strong>{' '}
                  <span className="text-stone-600 dark:text-stone-300">
                    12Rashi Astrology • Sole Proprietorship: 12rashi Infotech • Legal Name: Basudeo Shah
                  </span>
                </div>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                  Export ready at 1200×360px high-res PNG
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'saffron-horizontal',
                    title: '1. Flagship Saffron Navbar Logo',
                    subtitle: 'Warm Ivory Background • Royal Surya Emblem',
                    sample: BRAND_ICON_SAMPLES[0],
                    theme: 'light' as const,
                    containerClass: 'bg-amber-50 border-orange-200 text-stone-900',
                    subClass: 'text-orange-700',
                    metaClass: 'text-stone-500',
                  },
                  {
                    key: 'cosmic-dark-banner',
                    title: '2. Midnight Cosmic Dark Logo',
                    subtitle: 'Deep Space Navy • Zodiac Astrolabe Emblem',
                    sample: BRAND_ICON_SAMPLES[1],
                    theme: 'dark' as const,
                    containerClass: 'bg-slate-950 border-indigo-800 text-white',
                    subClass: 'text-amber-300',
                    metaClass: 'text-stone-400',
                  },
                  {
                    key: 'temple-heritage-crest',
                    title: '3. Temple Crimson Puja & Remedy Logo',
                    subtitle: 'Saffron Gradient • Shri Yantra Lotus Emblem',
                    sample: BRAND_ICON_SAMPLES[2],
                    theme: 'saffron' as const,
                    containerClass: 'bg-gradient-to-r from-orange-600 to-amber-700 border-amber-400 text-white',
                    subClass: 'text-amber-100',
                    metaClass: 'text-orange-100',
                  },
                  {
                    key: 'minimal-ivory-seal',
                    title: '4. Modern Minimal Yantra Wordmark',
                    subtitle: 'Architectural Ivory • 12R Geometric Seal',
                    sample: BRAND_ICON_SAMPLES[3],
                    theme: 'light' as const,
                    containerClass: 'bg-stone-50 border-stone-300 text-stone-900',
                    subClass: 'text-amber-700',
                    metaClass: 'text-stone-500',
                  },
                  {
                    key: 'obsidian-pro-dark',
                    title: '5. Astrologer Partner Pro Console Logo',
                    subtitle: 'Obsidian Matte • North-Indian Kundli Diamond',
                    sample: BRAND_ICON_SAMPLES[5],
                    theme: 'dark' as const,
                    containerClass: 'bg-stone-900 border-stone-700 text-white',
                    subClass: 'text-amber-400',
                    metaClass: 'text-stone-400',
                  },
                  {
                    key: 'signature-classic-surya',
                    title: '6. Signature 12Rashi Sun Disc Lockup',
                    subtitle: 'Classic Portal Emblem • Legal Proprietorship Stamp',
                    sample: BRAND_ICON_SAMPLES[4],
                    theme: 'light' as const,
                    containerClass: 'bg-white border-orange-300 text-stone-900',
                    subClass: 'text-orange-600',
                    metaClass: 'text-stone-500',
                  },
                ].map((card) => (
                  <div
                    key={card.key}
                    className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900 shadow-xs flex flex-col"
                  >
                    <div className={`p-5 border-b flex items-center gap-4 ${card.containerClass}`}>
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0">
                        {card.sample.imageSrc ? (
                          <img
                            src={card.sample.imageSrc}
                            alt={card.sample.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LogoIconGlyph presetId={card.sample.id} size={64} className="w-full h-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-serif font-black text-xl sm:text-2xl tracking-tight leading-none">
                          12Rashi Astrology
                        </div>
                        <div className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${card.subClass}`}>
                          Vedic Jyotish & Live Consultations
                        </div>
                        <div className={`text-[10px] mt-1 ${card.metaClass}`}>
                          Prop: 12rashi Infotech • Basudeo Shah
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between gap-2 bg-stone-50 dark:bg-stone-900/80">
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white">{card.title}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">{card.subtitle}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => applyAsActiveLogo(card.sample)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                            activeLogoPreset === card.sample.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-orange-600 hover:text-white'
                          }`}
                        >
                          {activeLogoPreset === card.sample.id ? 'Active' : 'Apply'}
                        </button>
                        <button
                          onClick={() => handleDownloadLogoLockup(card.key, card.sample, card.theme)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1 cursor-pointer transition"
                        >
                          {downloadedId === card.key ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          <span>PNG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

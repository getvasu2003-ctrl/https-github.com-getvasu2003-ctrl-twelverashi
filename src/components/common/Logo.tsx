import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { BRAND_ICON_SAMPLES } from '../../data/brandIconsData.ts';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  presetOverride?: string;
}

export const LogoIconGlyph: React.FC<{ presetId?: string; size?: number; className?: string }> = ({
  presetId = 'default-chakra',
  size = 42,
  className = '',
}) => {
  const sample = BRAND_ICON_SAMPLES.find((item) => item.id === presetId);

  if (sample?.imageSrc) {
    return (
      <img
        src={sample.imageSrc}
        alt={sample.name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className={`rounded-xl object-cover shadow-md border border-amber-400/40 ${className}`}
      />
    );
  }

  if (presetId === 'obsidian-kundli') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`drop-shadow-md rounded-xl ${className}`}
      >
        <defs>
          <linearGradient id="obsidianBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C1917" />
            <stop offset="100%" stopColor="#0C0A09" />
          </linearGradient>
          <linearGradient id="obsidianGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#obsidianBg)" stroke="url(#obsidianGold)" strokeWidth="2.5" />
        <rect x="16" y="16" width="68" height="68" fill="none" stroke="url(#obsidianGold)" strokeWidth="2" />
        <line x1="16" y1="16" x2="84" y2="84" stroke="url(#obsidianGold)" strokeWidth="1.5" opacity="0.85" />
        <line x1="84" y1="16" x2="16" y2="84" stroke="url(#obsidianGold)" strokeWidth="1.5" opacity="0.85" />
        <polygon points="50,16 84,50 50,84 16,50" fill="none" stroke="#FDE047" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="#1C1917" stroke="#FBBF24" strokeWidth="2" />
        <text
          x="50"
          y="55"
          fontFamily="'Cinzel', serif"
          fontSize="14"
          fontWeight="900"
          textAnchor="middle"
          fill="#FDE047"
        >
          12
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient id="rashiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Outer Auspicious Ring */}
      <circle cx="50" cy="50" r="48" fill="url(#rashiGradient)" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* 12 Radiant Rays (Representing the 12 Bhavas & 12 Rashis) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 26 * Math.cos(angle);
        const y1 = 50 + 26 * Math.sin(angle);
        const x2 = 50 + 42 * Math.cos(angle);
        const y2 = 50 + 42 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FEF08A"
            strokeWidth="1.5"
            opacity="0.9"
          />
        );
      })}

      {/* Inner Sacred Sun Surya Disc */}
      <circle cx="50" cy="50" r="23" fill="#C2410C" stroke="url(#goldGradient)" strokeWidth="2" />
      <circle cx="50" cy="50" r="16" fill="url(#goldGradient)" opacity="0.9" />

      {/* Center 12 Symbol */}
      <text
        x="50"
        y="54"
        fontFamily="'Cinzel', serif"
        fontSize="15"
        fontWeight="900"
        textAnchor="middle"
        fill="#7C2D12"
      >
        12
      </text>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  presetOverride,
}) => {
  let activePreset = 'default-chakra';
  try {
    const app = useApp();
    activePreset = presetOverride || app.activeLogoPreset || 'default-chakra';
  } catch {
    activePreset = presetOverride || 'default-chakra';
  }

  const iconSize = size === 'sm' ? 34 : size === 'lg' ? 52 : 42;
  const textSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sacred 12 Rashi Zodiac Chakra Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <LogoIconGlyph presetId={activePreset} size={iconSize} />

        {/* Pulsing subtle glow dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full animate-ping opacity-75 pointer-events-none" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-stone-900 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-serif tracking-tight font-extrabold text-stone-900 dark:text-stone-50 ${textSize}`}>
            12<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">Rashi</span>
            <span className="text-amber-600 dark:text-amber-400 font-serif font-black ml-1 text-[0.8em]">Astrology</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold tracking-wider uppercase scale-90 shadow-xs">
            Live
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-widest text-orange-600 dark:text-orange-400/90 uppercase mt-0.5">
            Vedic Jyotish & Kundli • 12rashi Infotech
          </span>
        )}
      </div>
    </div>
  );
};

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const iconSize = size === 'sm' ? 34 : size === 'lg' ? 52 : 42;
  const textSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sacred 12 Rashi Zodiac Chakra Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          className="drop-shadow-md"
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

        {/* Pulsing subtle glow dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-400 rounded-full animate-ping opacity-75 pointer-events-none" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-stone-900 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 leading-none">
          <span className={`font-serif tracking-tight font-extrabold text-stone-900 dark:text-stone-50 ${textSize}`}>
            12<span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">Rashi</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold tracking-wider uppercase scale-90 shadow-xs">
            Live
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-widest text-orange-600 dark:text-orange-400/90 uppercase mt-0.5">
            Vedic Jyotish & Kundli
          </span>
        )}
      </div>
    </div>
  );
};

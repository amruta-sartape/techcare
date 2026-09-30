import React from 'react';

interface TechCareLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cyan' | 'emerald' | 'purple' | 'amber';
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
}

export const TechCareLogo: React.FC<TechCareLogoProps> = ({
  size = 'md',
  variant = 'cyan',
  subtitle,
  showBadge = true,
  badgeText = 'PRO',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg text-sm',
    md: 'w-9 h-9 rounded-xl text-base',
    lg: 'w-11 h-11 rounded-2xl text-xl'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const variantGradients = {
    cyan: {
      bg: 'from-blue-600 via-cyan-500 to-teal-400',
      border: 'border-cyan-400/40',
      ambientGlow: 'bg-cyan-500/25',
      textAccent: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
      stroke: 'stroke-cyan-300',
      dot: 'fill-cyan-400'
    },
    emerald: {
      bg: 'from-emerald-600 via-teal-500 to-cyan-400',
      border: 'border-emerald-400/40',
      ambientGlow: 'bg-emerald-500/25',
      textAccent: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
      stroke: 'stroke-emerald-300',
      dot: 'fill-emerald-400'
    },
    purple: {
      bg: 'from-purple-600 via-indigo-500 to-cyan-400',
      border: 'border-purple-400/40',
      ambientGlow: 'bg-purple-500/25',
      textAccent: 'text-purple-400',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
      stroke: 'stroke-purple-300',
      dot: 'fill-purple-400'
    },
    amber: {
      bg: 'from-amber-600 via-orange-500 to-yellow-400',
      border: 'border-amber-400/40',
      ambientGlow: 'bg-amber-500/25',
      textAccent: 'text-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
      stroke: 'stroke-amber-300',
      dot: 'fill-amber-400'
    }
  };

  const v = variantGradients[variant as keyof typeof variantGradients] || variantGradients.cyan;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Shield/Wrench Emblem - Isolated layer with razor-sharp rendering */}
      <div className="relative group/logo flex items-center justify-center shrink-0 isolate">
        {/* Subtle professional ambient glow: placed strictly behind the emblem so it never blurs the logo mark */}
        <span
          className={`absolute -inset-1 rounded-xl ${v.ambientGlow} blur-sm opacity-40 sm:opacity-60 -z-10 pointer-events-none transition-opacity duration-300 group-hover/logo:opacity-90`}
          aria-hidden="true"
        />

        <div
          className={`${iconSizes[size]} bg-gradient-to-br ${v.bg} p-[1px] border ${v.border} transition-all duration-300 group-hover/logo:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}
        >
          {/* Solid opaque high-contrast dark core prevents any background glow bleeding */}
          <div className="w-full h-full bg-[#080d19] rounded-[inherit] flex items-center justify-center relative overflow-hidden">
            {/* Custom SVG Monogram / Technical Wrench-Crosshair Emblem */}
            <svg
              className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} relative z-10 shrink-0`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
            >
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                className={v.stroke}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="17.5" cy="6.5" r="1.5" className={`${v.dot} animate-pulse`} />
            </svg>
          </div>
        </div>
      </div>

      {/* Typography Lockup */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} font-black tracking-tight text-white font-sans`}>
            Tech<span className={v.textAccent}>Care</span>
          </span>
          {showBadge && (
            <span
              className={`text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${v.badgeBg}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

import React from 'react';

export const RevenueTrendChart: React.FC<{
  data?: { month: string; revenue: number; orders: number }[];
}> = ({
  data = [
    { month: 'Oct', revenue: 18400, orders: 82 },
    { month: 'Nov', revenue: 22100, orders: 98 },
    { month: 'Dec', revenue: 26800, orders: 114 },
    { month: 'Jan', revenue: 24500, orders: 105 },
    { month: 'Feb', revenue: 29900, orders: 128 },
    { month: 'Mar', revenue: 34850, orders: 148 }
  ]
}) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15;
  const points = data.map((d, i) => {
    const x = 40 + (i / (data.length - 1)) * 480;
    const y = 180 - (d.revenue / maxRevenue) * 140;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 40,180 L ${points.join(' L ')} L 520,180 Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue (Last 6 Months)</span>
          <p className="text-2xl font-black text-slate-100 mt-0.5">₹3,45,850 <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1">+16.5% MoM</span></p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] inline-block" /> Revenue</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] inline-block" /> SLA Target</span>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 560 210" className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          {/* Grid lines */}
          <line x1="40" y1="40" x2="520" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="520" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="140" x2="520" y2="140" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="180" x2="520" y2="180" stroke="#334155" />

          {/* Area fill */}
          <path d={areaD} fill="url(#revenueGrad)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {data.map((d, i) => {
            const x = 40 + (i / (data.length - 1)) * 480;
            const y = 180 - (d.revenue / maxRevenue) * 140;
            return (
              <g key={d.month} className="group cursor-pointer">
                <circle cx={x} cy={y} r="5" className="fill-[#0a0d14] stroke-cyan-400 stroke-2 group-hover:scale-125 transition-transform" />
                <text x={x} y="200" textAnchor="middle" className="text-[11px] fill-slate-400 font-mono">{d.month}</text>
                <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] fill-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  ₹{(d.revenue / 1000).toFixed(1)}k
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const ServiceVolumeBarChart: React.FC = () => {
  const categories = [
    { name: 'Laptop Hardware', count: 42, color: 'bg-gradient-to-r from-blue-600 to-cyan-500', share: '38%' },
    { name: 'Mobile Display & Battery', count: 29, color: 'bg-gradient-to-r from-blue-500 to-indigo-500', share: '26%' },
    { name: 'OS & Security Support', count: 20, color: 'bg-gradient-to-r from-cyan-500 to-teal-400', share: '18%' },
    { name: 'Cleanroom Data Recovery', count: 14, color: 'bg-gradient-to-r from-amber-500 to-orange-500', share: '12%' },
    { name: 'Network Architecture', count: 7, color: 'bg-gradient-to-r from-purple-500 to-pink-500', share: '6%' }
  ];

  return (
    <div className="space-y-4">
      {categories.map((c) => (
        <div key={c.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">{c.name}</span>
            <span className="text-slate-400 font-mono">{c.count} orders ({c.share})</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full ${c.color} transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
              style={{ width: `${(c.count / 45) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatusDistributionPie: React.FC = () => {
  const items = [
    { label: 'Completed', count: 86, color: '#10b981' },
    { label: 'In Progress', count: 24, color: '#f59e0b' },
    { label: 'On The Way', count: 12, color: '#3b82f6' },
    { label: 'Created / New', count: 8, color: '#64748b' }
  ];

  return (
    <div className="flex items-center justify-around gap-4 py-2">
      {/* Visual SVG Donut */}
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#1e293b" strokeWidth="5" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="66 100" strokeDashoffset="0" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray="18 100" strokeDashoffset="-66" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="5" strokeDasharray="10 100" strokeDashoffset="-84" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#64748b" strokeWidth="5" strokeDasharray="6 100" strokeDashoffset="-94" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-slate-100 leading-none">130</span>
          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Total Jobs</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: it.color }} />
            <span className="text-slate-300 font-medium">{it.label}</span>
            <span className="font-mono font-bold text-slate-100 ml-auto">{it.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BarChart: React.FC<{
  data: { label: string; value: number }[];
  height?: number;
}> = ({ data, height = 180 }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex items-end gap-3 pt-6" style={{ height: `${height}px` }}>
      {data.map((item, idx) => {
        const heightPct = Math.round((item.value / maxVal) * 100);
        return (
          <div key={item.label || idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[10px] font-bold text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {item.value}
            </span>
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-t-lg relative flex items-end overflow-hidden h-full">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 rounded-t-lg transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-400 truncate max-w-full">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const DonutChart: React.FC<{
  data: { label: string; value: number; color?: string }[];
}> = ({ data }) => {
  const defaultColors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#1e293b" strokeWidth="5" />
          {data.map((slice, i) => {
            const pct = (slice.value / total) * 100;
            const strokeDash = `${pct} ${100 - pct}`;
            const strokeOffset = -accumulatedPercent;
            accumulatedPercent += pct;
            return (
              <circle
                key={slice.label}
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke={slice.color || defaultColors[i % defaultColors.length]}
                strokeWidth="5"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-slate-100 leading-none">{total}</span>
          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Total</span>
        </div>
      </div>

      <div className="space-y-2 text-xs w-full max-w-[200px]">
        {data.map((it, i) => (
          <div key={it.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: it.color || defaultColors[i % defaultColors.length] }}
              />
              <span className="text-slate-300 truncate font-medium">{it.label}</span>
            </div>
            <span className="font-mono font-bold text-slate-100 shrink-0">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};



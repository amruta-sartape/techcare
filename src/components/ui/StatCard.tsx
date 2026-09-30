import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
  iconColor?: string;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor = 'text-cyan-400',
  bgColor = 'bg-blue-500/10 border border-blue-500/20'
}) => {
  return (
    <div className="bg-[#0c101d]/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-lg glow-card transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor} ${iconColor} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <h4 className="text-2xl font-black text-white font-mono tracking-tight">{value}</h4>
        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span
              className={`inline-flex items-center text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                change.isPositive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {change.isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
              )}
              {change.value}
            </span>
          )}
          {subtitle && <span className="text-xs text-slate-400 truncate">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};


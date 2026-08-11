import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  linkTo?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, value, subtitle, icon: Icon, colorClass, bgClass, linkTo 
}) => {
  const content = (
    <div className={`group relative p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between ${linkTo ? 'cursor-pointer hover:border-primary/50' : ''}`}>
      {/* Background Decor */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgClass} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out blur-2xl`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${bgClass} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {subtitle && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10 text-sm text-slate-500 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );

  return linkTo ? <Link to={linkTo} className="block h-full">{content}</Link> : content;
};

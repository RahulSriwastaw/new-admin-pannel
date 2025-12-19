import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  change?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp, color = "blue", change }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    orange: "text-orange-500 bg-orange-500/10",
    red: "text-red-500 bg-red-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10"
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${selectedColor}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {change && <p className="text-xs text-gray-500 mt-2">{change}</p>}
    </div>
  );
};
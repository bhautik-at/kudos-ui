import React, { useState } from 'react';
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder';
import { PercentageBadge } from '../atoms/PercentageBadge';

interface PieChartProps {
  data: {
    id: string;
    name: string;
    count: number;
    percentage: number;
  }[];
  isLoading?: boolean;
  className?: string;
  colorClasses?: string[];
  onItemClick?: (item: { id: string; name: string }) => void;
}

export const PieChart = ({
  data,
  isLoading = false,
  className = '',
  colorClasses = [
    'fill-blue-500',
    'fill-indigo-500',
    'fill-purple-500',
    'fill-pink-500',
    'fill-rose-500',
    'fill-orange-500',
    'fill-amber-500',
    'fill-yellow-500',
    'fill-lime-500',
    'fill-green-500',
    'fill-emerald-500',
    'fill-teal-500',
    'fill-cyan-500',
  ],
  onItemClick,
}: PieChartProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingPlaceholder height={400} className={className} />;
  }

  if (!data.length) {
    return (
      <div
        className={`flex items-center justify-center h-[400px] bg-gray-50 dark:bg-gray-800/30 rounded-lg ${className}`}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Calculate the total for generating the pie
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Sort data by count, descending
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Generate pie segments
  let cumulativePercentage = 0;
  const segments = sortedData.map((item, index) => {
    const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
    const itemPercentage = (item.count / total) * 100;
    cumulativePercentage += itemPercentage;
    const endAngle = cumulativePercentage * 3.6;

    const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    // Path for the pie segment
    const d = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const colorClass = colorClasses[index % colorClasses.length];

    return {
      ...item,
      d,
      colorClass,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-8 ${className}`}>
      <div className="relative w-64 h-64 animate-reveal">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-xl">
          <circle cx="50" cy="50" r="42" className="fill-gray-50 dark:fill-gray-800" />
          {segments.map((segment, idx) => (
            <path
              key={segment.id}
              d={segment.d}
              className={`${segment.colorClass} stroke-white dark:stroke-gray-900 stroke-[0.5] hover:opacity-90 transition-all duration-300 ease-in-out ${
                hoveredSegment && hoveredSegment !== segment.id
                  ? 'opacity-60 scale-[0.98]'
                  : 'opacity-100 scale-100'
              }`}
              onMouseEnter={() => setHoveredSegment(segment.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => onItemClick && onItemClick({ id: segment.id, name: segment.name })}
              style={{
                cursor: onItemClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                transformOrigin: '50% 50%',
                transform: hoveredSegment === segment.id ? 'scale(1.03)' : 'scale(1)',
                // Add a small animation delay based on index
                animationDelay: `${idx * 50}ms`,
              }}
            />
          ))}
          <circle cx="50" cy="50" r="25" className="fill-white dark:fill-gray-900/80 opacity-80" />
        </svg>
      </div>

      <div className="flex flex-col gap-3 max-w-xs w-full animate-slideIn">
        {segments.map((segment, idx) => (
          <div
            key={segment.id}
            className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
              hoveredSegment === segment.id
                ? 'bg-gray-100 dark:bg-gray-800 shadow-sm transform translate-x-1'
                : 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
            onClick={() => onItemClick && onItemClick({ id: segment.id, name: segment.name })}
            style={{
              cursor: onItemClick ? 'pointer' : 'default',
              animationDelay: `${idx * 50 + 200}ms`,
            }}
          >
            <div
              className={`w-4 h-4 rounded-sm flex-shrink-0 ${segment.colorClass.replace('fill-', 'bg-')}`}
              style={{
                boxShadow: hoveredSegment === segment.id ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate dark:text-gray-200" title={segment.name}>
                {segment.name}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold tabular-nums dark:text-gray-200">
                {segment.count}
              </span>
              <PercentageBadge value={segment.percentage} />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes reveal {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-reveal {
          animation: reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

import React from 'react';
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder';
import { PercentageBadge } from '../atoms/PercentageBadge';

interface BarChartProps {
  data: {
    id: string;
    name: string;
    count: number;
    percentage: number;
  }[];
  isLoading?: boolean;
  maxItems?: number;
  showPercentage?: boolean;
  barColor?: string;
  className?: string;
  onItemClick?: (item: { id: string; name: string }) => void;
}

export const BarChart = ({
  data,
  isLoading = false,
  maxItems = 10,
  showPercentage = true,
  barColor = 'bg-gradient-to-r from-blue-500 to-indigo-600',
  className = '',
  onItemClick,
}: BarChartProps) => {
  const limitedData = data.slice(0, maxItems);

  if (isLoading) {
    return <LoadingPlaceholder height={300} className={className} />;
  }

  if (!data.length) {
    return (
      <div
        className={`flex items-center justify-center h-[350px] bg-gray-50 dark:bg-gray-800/30 rounded-lg ${className}`}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Find the maximum count for scaling
  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <div className={`space-y-5 ${className}`}>
      {limitedData.map((item, index) => (
        <div
          key={item.id}
          className="space-y-2 group animate-fadeIn"
          onClick={() => onItemClick && onItemClick({ id: item.id, name: item.name })}
          role={onItemClick ? 'button' : 'presentation'}
          tabIndex={onItemClick ? 0 : undefined}
          onKeyDown={e => {
            if (onItemClick && (e.key === 'Enter' || e.key === ' ')) {
              onItemClick({ id: item.id, name: item.name });
            }
          }}
          style={{
            // Add slight animation delay based on index for staggered effect
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium mr-2">
                {index + 1}
              </div>
              <p className="text-sm font-medium truncate dark:text-gray-200" title={item.name}>
                {item.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tabular-nums dark:text-gray-200">
                {item.count}
              </span>
              {showPercentage && <PercentageBadge value={item.percentage} />}
            </div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className={`${barColor} h-full rounded-full shadow-sm transition-all duration-500 ease-out`}
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                transform: 'translateZ(0)', // Force hardware acceleration
              }}
            />
          </div>
        </div>
      ))}

      {data.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center pt-3 italic">
          {data.length - maxItems} more items not shown
        </p>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

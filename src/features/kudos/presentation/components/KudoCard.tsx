import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type KudoColor = 'pink' | 'blue' | 'orange' | 'purple' | 'teal' | 'green' | 'emerald' | 'yellow';

interface KudoCardProps {
  title: string;
  message: string;
  sender?: string;
  color: KudoColor;
  icon?: React.ReactNode | string;
  recipient?: string;
  category?: string;
  date?: Date;
  onEdit?: () => void;
  id: string;
}

const colorClasses: Record<KudoColor, string> = {
  pink: 'bg-pink-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
};

const KudoCard: React.FC<KudoCardProps> = ({
  title,
  message,
  sender,
  color,
  icon,
  recipient,
  category,
  date,
  id,
}) => {
  return (
    <div className="animate-fade-in bg-white rounded-md overflow-hidden shadow-md w-full h-full flex flex-col">
      <div
        className={cn(
          'p-2 text-center text-white font-semibold uppercase tracking-wide',
          colorClasses[color]
        )}
      >
        {category || title}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {recipient && <div className="mb-2 font-medium text-gray-800">To: {recipient}</div>}
        <div className="flex mb-2">
          {icon && <div className="mr-2 flex-shrink-0 text-xl">{icon}</div>}
          <p className="text-gray-700 text-sm flex-1">{message}</p>
        </div>
        <div className="mt-auto pt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">{date && format(date, 'MMM d, yyyy')}</div>
          {sender && <div className="text-gray-500 text-sm">From: {sender}</div>}
        </div>
      </div>
    </div>
  );
};

export default KudoCard;

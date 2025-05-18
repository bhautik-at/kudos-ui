import React from 'react';

interface KudosCardProps {
  title: string;
  message: string;
  emoji?: string;
}

export const KudosCard: React.FC<KudosCardProps> = ({
  title,
  message,
  emoji,
}) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#E91E63] text-white px-6 py-4">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      
      {/* Content */}
      <div className="bg-white p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg 
              className="w-8 h-8" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M7 11V7a5 5 0 0110 0v4" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M4 11h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" 
                stroke="black" 
                strokeWidth="2"
              />
            </svg>
          </div>
          <p className="text-gray-700">{message}</p>
        </div>
        {emoji && (
          <div className="mt-4 text-right">
            <span className="text-xl">{emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 
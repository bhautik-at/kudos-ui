import React from 'react';
import KudoCard from './KudoCard';

interface Kudo {
  id: string;
  recipientId: string;
  recipientName: string;
  senderId: string;
  senderName: string;
  teamId: string;
  teamName: string;
  categoryId: string;
  categoryName: string;
  message: string;
  organizationId: string;
  createdAt: string;
}

interface KudoListProps {
  kudos: Kudo[];
  isLoading?: boolean;
}

// Map categoryId to a color
const getCategoryColor = (categoryId: string): any => {
  // Use a hash function to assign consistent colors based on category ID
  const colors = ['pink', 'blue', 'orange', 'purple', 'teal', 'green', 'emerald', 'yellow'];
  const hash = categoryId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Map categories to emojis
const getCategoryEmoji = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    Teamwork: '👥',
    Innovation: '💡',
    Leadership: '🚀',
    'Problem Solving': '🧩',
    'Customer Focus': '🎯',
    Quality: '✨',
    Communication: '💬',
    Productivity: '⚡',
    Creativity: '🎨',
    Mentorship: '🧠',
    Collaboration: '🤝',
    'Technical Excellence': '🔧',
  };

  return categoryMap[categoryName] || '🏆'; // Default emoji if category not found
};

export const KudoList: React.FC<KudoListProps> = ({ kudos, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (kudos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">No kudos found.</p>
        <p className="text-muted-foreground text-sm">
          Be the first to recognize someone's great work by creating a kudo!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {kudos.map(kudo => (
        <KudoCard
          key={kudo.id}
          id={kudo.id}
          title={kudo.categoryName}
          message={kudo.message}
          sender={kudo.senderName}
          recipient={kudo.recipientName}
          category={kudo.categoryName}
          date={new Date(kudo.createdAt)}
          color={getCategoryColor(kudo.categoryId)}
          icon={getCategoryEmoji(kudo.categoryName)}
        />
      ))}
    </div>
  );
};

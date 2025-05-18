import React, { useState } from 'react';
import { Autocomplete } from '@/shared/components/molecules/Autocomplete';
import { Button } from '@/shared/components/atoms/Button';
import { Label } from '@/shared/components/atoms/Label';
import { X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface KudoFiltersProps {
  recipients: FilterOption[];
  teams: FilterOption[];
  categories: FilterOption[];
  onFilterChange: (filters: KudoFilters) => void;
  className?: string;
}

export interface KudoFilters {
  recipientId?: string;
  teamId?: string;
  categoryId?: string;
}

export const KudoFilters: React.FC<KudoFiltersProps> = ({
  recipients,
  teams,
  categories,
  onFilterChange,
  className = '',
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleRecipientChange = (value: string) => {
    setSelectedRecipient(value);
    applyFilters({
      recipientId: value,
      teamId: selectedTeam,
      categoryId: selectedCategory,
    });
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    applyFilters({
      recipientId: selectedRecipient,
      teamId: value,
      categoryId: selectedCategory,
    });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    applyFilters({
      recipientId: selectedRecipient,
      teamId: selectedTeam,
      categoryId: value,
    });
  };

  const applyFilters = (filters: KudoFilters) => {
    // Remove empty values
    const cleanFilters: KudoFilters = {};
    if (filters.recipientId) cleanFilters.recipientId = filters.recipientId;
    if (filters.teamId) cleanFilters.teamId = filters.teamId;
    if (filters.categoryId) cleanFilters.categoryId = filters.categoryId;

    onFilterChange(cleanFilters);
  };

  const clearFilters = () => {
    setSelectedRecipient('');
    setSelectedTeam('');
    setSelectedCategory('');
    onFilterChange({});
  };

  const hasActiveFilters = selectedRecipient || selectedTeam || selectedCategory;

  return (
    <div className={`bg-card p-4 rounded-md shadow-sm mb-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="recipient-filter" className="mb-1 block">
            Recipient
          </Label>
          <Autocomplete
            options={recipients}
            placeholder="Filter by recipient"
            value={selectedRecipient}
            onChange={handleRecipientChange}
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="team-filter" className="mb-1 block">
            Team
          </Label>
          <Autocomplete
            options={teams}
            placeholder="Filter by team"
            value={selectedTeam}
            onChange={handleTeamChange}
          />
        </div>

        <div className="flex-1">
          <Label htmlFor="category-filter" className="mb-1 block">
            Category
          </Label>
          <Autocomplete
            options={categories}
            placeholder="Filter by category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {hasActiveFilters && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

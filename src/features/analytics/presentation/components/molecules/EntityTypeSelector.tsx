import React from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { EntityType } from '../../../domain/interfaces/AnalyticsRepository';

interface EntityTypeSelectorProps {
  entityType: EntityType;
  onChange: (type: EntityType) => void;
  className?: string;
}

export const EntityTypeSelector = ({
  entityType,
  onChange,
  className,
}: EntityTypeSelectorProps) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button
        variant={entityType === 'individuals' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('individuals')}
      >
        Individuals
      </Button>
      <Button
        variant={entityType === 'teams' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('teams')}
      >
        Teams
      </Button>
    </div>
  );
};

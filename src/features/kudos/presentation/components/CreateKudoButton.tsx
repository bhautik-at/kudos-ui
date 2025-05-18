import { Button } from '@/shared/components/atoms/Button';
import { PlusCircle } from 'lucide-react';

interface CreateKudoButtonProps {
  onClick: () => void;
}

export const CreateKudoButton = ({ onClick }: CreateKudoButtonProps) => {
  return (
    <Button onClick={onClick} variant="default" size="sm">
      <PlusCircle className="h-5 w-5 mr-2" />
      Create Kudo
    </Button>
  );
};

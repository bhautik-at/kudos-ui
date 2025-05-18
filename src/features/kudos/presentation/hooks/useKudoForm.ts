import { useState, useCallback } from 'react';
import { useCreateKudo } from './useCreateKudo';
import { CreateKudoInputDto } from '../../application/dtos/CreateKudoInputDto';
import { useToast } from '@/shared/hooks/use-toast';

export const useKudoForm = (organizationId: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createKudo, isLoading, error } = useCreateKudo();
  const { toast } = useToast();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateKudoInputDto): Promise<void> => {
      try {
        await createKudo(data);
      } catch (err) {
        console.error('Error creating kudo:', err);
        toast({
          title: 'Error',
          type: 'error',
        });
        throw err; // Re-throw to let the modal component handle it
      }
    },
    [createKudo, toast]
  );

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleSubmit,
    isLoading,
    error,
  };
};

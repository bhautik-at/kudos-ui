import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { DashboardLayout } from '@/shared/components/templates';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CreateKudoButton } from '@/features/kudos/presentation/components/CreateKudoButton';
import { CreateKudoModal } from '@/features/kudos/presentation/components/CreateKudoModal';
import { CreateKudoInputDto } from '@/features/kudos/application/dtos/CreateKudoInputDto';
import { KudoApiClient } from '@/features/kudos/infrastructure/api/KudoApiClient';
import { useToast } from '@/shared/hooks/use-toast';
import { KudoList } from '@/features/kudos/presentation/components/KudoList';
import { useKudos } from '@/features/kudos/presentation/hooks/useKudos';
import {
  KudoFilters,
  KudoFilters as KudoFiltersType,
} from '@/features/kudos/presentation/components/KudoFilters';
import { KudosHeader } from '@/features/kudos/presentation/components/KudosHeader';

export const DashboardTemplate = () => {
  const { user } = useUser();
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<string>('');
  const [isCreateKudoModalOpen, setIsCreateKudoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Get kudos for the current organization
  const {
    kudos,
    isLoading: isLoadingKudos,
    refetch: refetchKudos,
    applyFilters,
    filterOptions,
  } = useKudos(organizationId);

  // Extract organization ID from query parameters
  useEffect(() => {
    const { orgId } = router.query;
    if (orgId && typeof orgId === 'string') {
      setOrganizationId(orgId);
    }
  }, [router.query]);

  const handleOpenCreateKudoModal = () => {
    setIsCreateKudoModalOpen(true);
  };

  const handleCloseCreateKudoModal = () => {
    setIsCreateKudoModalOpen(false);
  };

  const handleCreateKudo = async (data: CreateKudoInputDto) => {
    setIsSubmitting(true);
    try {
      const kudoApiClient = new KudoApiClient();

      // Convert the data to the format expected by the API
      const apiData = {
        recipient_id: data.recipientId,
        team_id: data.teamId,
        category_id: data.categoryId,
        message: data.message,
        organization_id: data.organizationId,
      };

      // Call the API
      await kudoApiClient.createKudo(apiData);

      // Show success message
      toast({
        title: 'Kudo created successfully!',
        type: 'success',
      });

      // Refresh the kudos list
      refetchKudos();

      // Close the modal
      handleCloseCreateKudoModal();
    } catch (error) {
      // Show error message
      toast({
        title:
          'Failed to create kudo: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'error',
      });
      console.error('Error creating kudo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (filters: KudoFiltersType) => {
    applyFilters(filters);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to your dashboard{user?.firstName ? `, ${user.firstName}` : ''}!
              </h2>
              <p className="text-muted-foreground">
                You can manage your Kudos and team members from here.
              </p>
            </div>
            {organizationId && (
              <div>
                <CreateKudoButton onClick={handleOpenCreateKudoModal} />
              </div>
            )}
          </div>
        </div>

        {/* Kudos list */}
        <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
          <KudosHeader count={kudos.length} />

          {/* Filters */}
          {!isLoadingKudos && filterOptions && (
            <KudoFilters
              recipients={filterOptions.recipients}
              teams={filterOptions.teams}
              categories={filterOptions.categories}
              onFilterChange={handleFilterChange}
            />
          )}

          <KudoList kudos={kudos} isLoading={isLoadingKudos} />
        </div>
      </div>

      {/* Create Kudo Modal */}
      {organizationId && (
        <CreateKudoModal
          isOpen={isCreateKudoModalOpen}
          onClose={handleCloseCreateKudoModal}
          onSubmit={handleCreateKudo}
          organizationId={organizationId}
        />
      )}
    </DashboardLayout>
  );
};

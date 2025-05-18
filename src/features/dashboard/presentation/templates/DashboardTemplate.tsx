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
import { Heart, Plus, Award, Filter, Search } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/atoms/Card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/Tooltip';

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
      <div className="space-y-6">
        {/* Dashboard Header - styled similar to UserManagementHeader */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-md">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kudo Wall
              </h1>
              <p className="text-md font-semibold text-muted-foreground mt-1">
                Time to give some well-deserved kudos!”small wins and big efforts.
              </p>
            </div>
          </div>

          {organizationId && (
            <div>
              {/* Desktop version with text */}
              <Button
                onClick={handleOpenCreateKudoModal}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
              >
                <Heart className="h-4 w-4" />
                <span>Give Kudos</span>
              </Button>

              {/* Mobile version with icon only */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleOpenCreateKudoModal}
                      size="icon"
                      className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                      aria-label="Give Kudos"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Give Kudos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Kudos list with modern styling */}
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-blue-100 dark:border-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Kudos</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {kudos.length} kudos in your organization
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80"
                onClick={() => applyFilters({})}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </CardHeader>
          </div>

          <CardContent className="pt-6">
            {/* Filters */}
            {!isLoadingKudos && filterOptions && (
              <div className="mb-6">
                <KudoFilters
                  recipients={filterOptions.recipients}
                  teams={filterOptions.teams}
                  categories={filterOptions.categories}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Kudo List */}
            <KudoList kudos={kudos} isLoading={isLoadingKudos} />
          </CardContent>
        </Card>
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

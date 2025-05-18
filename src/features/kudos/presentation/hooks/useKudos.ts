import { useState, useEffect, useCallback } from 'react';
import { KudoApiClient } from '../../infrastructure/api/KudoApiClient';
import { KudoFilters } from '../components/KudoFilters';

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

export const useKudos = (organizationId: string) => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [filters, setFilters] = useState<KudoFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [allKudos, setAllKudos] = useState<Kudo[]>([]); // Store all kudos for filter options

  // Function to fetch kudos with or without filters
  const fetchKudos = useCallback(
    async (customFilters?: KudoFilters) => {
      if (!organizationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const kudoApiClient = new KudoApiClient();
        const filtersToApply = customFilters || filters;

        // Prepare API params with filters
        const params: any = {
          organization_id: organizationId,
        };

        // Add filters to API params if they exist
        if (filtersToApply.recipientId) {
          params.recipient_id = filtersToApply.recipientId;
        }

        if (filtersToApply.teamId) {
          params.team_id = filtersToApply.teamId;
        }

        if (filtersToApply.categoryId) {
          params.category_id = filtersToApply.categoryId;
        }

        // Call the API with filters
        const response = await kudoApiClient.getKudos(params);

        // Extract kudos from the response
        const kudosData = response.data || [];

        // Convert API response to our Kudo interface format
        const formattedKudos = kudosData.map(kudo => ({
          id: kudo.id,
          recipientId: kudo.recipient_id,
          recipientName: kudo.recipient_name,
          senderId: kudo.sender_id,
          senderName: kudo.sender_name,
          teamId: kudo.team_id,
          teamName: kudo.team_name,
          categoryId: kudo.category_id,
          categoryName: kudo.category_name,
          message: kudo.message,
          organizationId: kudo.organization_id,
          createdAt: kudo.created_at,
        }));

        setKudos(formattedKudos);

        // If we fetched without filters, update our allKudos reference
        if (Object.keys(filtersToApply).length === 0) {
          setAllKudos(formattedKudos);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error fetching kudos:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [organizationId, filters]
  );

  // Initial fetch of all kudos when component mounts or organizationId changes
  useEffect(() => {
    // This will fetch without filters
    fetchKudos({});
  }, [organizationId]);

  // Function to handle filter changes
  const applyFilters = useCallback(
    (newFilters: KudoFilters) => {
      setFilters(newFilters);
      // Call the API with the new filters
      fetchKudos(newFilters);
    },
    [fetchKudos]
  );

  // Extract unique options for filter dropdowns from allKudos
  const getFilterOptions = useCallback(() => {
    const recipients = Array.from(new Set(allKudos.map(k => k.recipientId))).map(id => {
      const kudo = allKudos.find(k => k.recipientId === id);
      return {
        value: id,
        label: kudo?.recipientName || id,
      };
    });

    const teams = Array.from(new Set(allKudos.map(k => k.teamId))).map(id => {
      const kudo = allKudos.find(k => k.teamId === id);
      return {
        value: id,
        label: kudo?.teamName || id,
      };
    });

    const categories = Array.from(new Set(allKudos.map(k => k.categoryId))).map(id => {
      const kudo = allKudos.find(k => k.categoryId === id);
      return {
        value: id,
        label: kudo?.categoryName || id,
      };
    });

    return { recipients, teams, categories };
  }, [allKudos]);

  return {
    kudos, // Filtered kudos from API
    allKudos, // Unfiltered list for filter options
    isLoading,
    error,
    refetch: () => fetchKudos(filters), // Refetch with current filters
    applyFilters,
    filterOptions: getFilterOptions(),
    currentFilters: filters,
  };
};

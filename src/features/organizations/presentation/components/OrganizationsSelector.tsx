import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/shared/components/atoms/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/components/atoms/Select';
import { Label } from '@/shared/components/atoms/Label';
import { useOrganizations } from '../hooks/useOrganizations';
import { Spinner } from '@/shared/components/atoms/Spinner';

export const OrganizationsSelector = () => {
  const router = useRouter();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const { organizations, isLoading, error, refreshOrganizations } = useOrganizations();

  const handleSelectOrg = (value: string) => {
    setSelectedOrgId(value);
  };

  const handleContinue = () => {
    if (selectedOrgId) {
      // Navigate to dashboard with the selected organization
      router.push(`/dashboard?orgId=${selectedOrgId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="organization">Select Organization</Label>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Spinner size="md" />
          </div>
        )}

        {error && !isLoading && (
          <div className="py-4 text-center">
            <p className="text-destructive mb-2">Failed to load organizations</p>
            <Button variant="outline" size="sm" onClick={refreshOrganizations}>
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !error && organizations.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">You don't have any organizations yet</p>
            <Button onClick={() => router.push('/organization')}>Create Organization</Button>
          </div>
        )}

        {!isLoading && !error && organizations.length > 0 && (
          <>
            <Select onValueChange={handleSelectOrg} value={selectedOrgId}>
              <SelectTrigger id="organization" className="w-full">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button className="w-full mt-4" onClick={handleContinue} disabled={!selectedOrgId}>
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

import { OrganizationForm } from '../components/OrganizationForm';
import { useCreateOrganization } from '../hooks/useCreateOrganization';

export function OrganizationTemplate() {
  const { createOrganization, isLoading, error } = useCreateOrganization();

  const handleSubmit = async (data: { name: string; description?: string }) => {
    await createOrganization(data.name, data.description);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">Create Your Organization</h1>
        <p className="mb-4 text-sm text-muted-foreground text-center">
          Create an organization to start managing your projects.
        </p>

        <OrganizationForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}

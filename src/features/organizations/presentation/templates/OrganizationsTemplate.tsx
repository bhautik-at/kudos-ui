import { OrganizationsSelector } from '../components/OrganizationsSelector';

export function OrganizationsTemplate() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center">Your Organizations</h1>
        <p className="mb-4 text-sm text-muted-foreground text-center">
          Select an existing organization or create a new one.
        </p>

        <OrganizationsSelector />
      </div>
    </div>
  );
}

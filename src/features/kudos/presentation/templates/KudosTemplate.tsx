import { KudosHeader } from '../components/KudosHeader';

interface KudosTemplateProps {
  organizationId: string;
}

export const KudosTemplate = ({ organizationId }: KudosTemplateProps) => {
  return (
    <div className="container mx-auto p-6">
      <KudosHeader organizationId={organizationId} title="Team Kudos" />

      <div className="bg-white rounded-lg shadow p-6">
        {/* Kudos list would go here */}
        <p className="text-gray-500">Kudos list will be displayed here.</p>
      </div>
    </div>
  );
};

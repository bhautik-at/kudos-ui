import { KudoCreator } from './KudoCreator';

interface KudosHeaderProps {
  count?: number;
  title?: string;
  organizationId?: string;
}

export const KudosHeader = ({
  count,
  title = 'Recent Kudos',
  organizationId,
}: KudosHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="text-muted-foreground text-sm">{count} kudos found</div>
      {organizationId && <KudoCreator organizationId={organizationId} />}
    </div>
  );
};

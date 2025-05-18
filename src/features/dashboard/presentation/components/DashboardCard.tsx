interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

import { useUser } from '@/features/users/presentation/contexts/UserContext';
import { DashboardLayout } from '@/shared/components/templates';

export const DashboardTemplate = () => {
  const { user } = useUser();

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to your dashboard{user?.firstName ? `, ${user.firstName}` : ''}!
          </h2>
          <p className="text-muted-foreground">
            You can manage your Kudos and team members from here.
          </p>
        </div>

        {/* Dashboard content would go here */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard cards/widgets */}
          <DashboardCard
            title="Total Kudos"
            value="42"
            icon="🏆"
            description="Kudos sent and received"
          />
          <DashboardCard
            title="Team Members"
            value="12"
            icon="👥"
            description="Active members in your team"
          />
          <DashboardCard
            title="Recent Activity"
            value="7"
            icon="📈"
            description="Actions in the last 7 days"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, description }) => {
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

import { useAuth } from '@/features/auth/presentation/contexts/AuthContext';
import { useUser } from '@/features/users/presentation/contexts/UserContext';

export const DashboardTemplate = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>
        <div className="bg-card text-card-foreground shadow-lg rounded-lg p-6">
          <p className="text-lg">
            Welcome to your dashboard{user?.firstName ? `, ${user.firstName}` : ''}!
          </p>
          <p className="mt-4">You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

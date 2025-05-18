import { UserRole } from '@/features/userManagement/domain/entities/UserRole';

// Mock user data to be shared across API endpoints
export const mockUsers = Array(20)
  .fill(null)
  .map((_, index) => ({
    id: `user-${index + 1}`,
    email: `user${index + 1}@example.com`,
    firstName: `First${index + 1}`,
    lastName: `Last${index + 1}`,
    role: index % 5 === 0 ? UserRole.TechLeader : UserRole.Member,
    isVerified: index % 3 === 0,
  }));

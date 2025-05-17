import { User } from '../../domain/entities/User';
import { UserOutputDto } from '../dtos/UserOutputDto';

export class UserMapper {
  /**
   * Maps a User entity to a UserOutputDto
   */
  static toDto(user: User): UserOutputDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      isVerified: user.isVerified,
      role: user.role,
    };
  }

  /**
   * Maps an API response object to a User entity
   */
  static fromApiResponse(responseData: any): User {
    return new User({
      id: responseData.id,
      email: responseData.email,
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      isVerified: responseData.isVerified,
      role: responseData.role,
    });
  }
}

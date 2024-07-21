import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new user.
 *
 * This DTO is used to define and validate the shape of data
 * required for user creation in the application.
 */
export class CreateUserDto {
  /**
   * The email of the user. It must be a valid email format and cannot be empty.
   */
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  /**
   * The name of the user. It must be a non-empty string.
   */
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  /**
   * The profile picture URL of the user. It must be a non-empty string.
   */
  @IsString({ message: 'Picture must be a string' })
  @IsNotEmpty({ message: 'Picture URL is required' })
  picture: string;
}

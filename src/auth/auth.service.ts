import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IUser } from './interfaces/user.interface'; // Import User interface
import { UserService } from './user.service'; // Import UserService

/**
 * Service for handling authentication-related operations.
 *
 * Provides methods for validating Google users, generating JWTs,
 * and managing user information based on JWT payloads.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Logger for debugging and info
  private client: OAuth2Client;

  /**
   * Constructs the AuthService instance.
   *
   * @param jwtService - Service for generating and validating JWT tokens
   * @param userService - Service for managing user data
   * @param configService - Service for accessing configuration values
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Google OAuth2 client with client ID from configuration
    this.client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  /**
   * Validates and retrieves or creates a user based on Google profile.
   *
   * @param profile - The Google user profile obtained after authentication
   * @returns The user object from the database
   * @throws UnauthorizedException if the user cannot be validated or created
   */
  async validateGoogleUser(profile: any): Promise<IUser> {
    const user = await this.userService.findOrCreate(profile);

    if (!user) {
      throw new UnauthorizedException('Failed to validate Google user');
    }

    return user;
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param userId - The ID of the user to retrieve
   * @returns The user object or null if not found
   */
  async validateUserById(userId: string): Promise<IUser | null> {
    return this.userService.findById(userId);
  }

  /**
   * Generates a JWT for a user.
   *
   * @param user - The user for whom to generate the JWT
   * @returns The generated JWT token
   */
  async generateJWT(user: IUser): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  /**
   * Validates a user based on JWT payload.
   *
   * @param payload - The JWT payload containing user information
   * @returns The user object
   * @throws UnauthorizedException if the user is not found
   */
  async validateUserByJwt(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid JWT token');
    }
    return user;
  }

  /**
   * Handles Google login process.
   *
   * Verifies the Google ID token, retrieves user information,
   * and generates a JWT token for the authenticated user.
   *
   * @param idToken - The Google ID token provided by the client
   * @returns An object containing user information and JWT token
   * @throws Error if the Google token is invalid
   */
  async googleLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token');
    }

    const { sub, email, name, picture } = payload;
    const user = { id: sub, email, name, picture };

    const userFromDB = await this.validateGoogleUser(payload);
    const jwtToken = await this.generateJWT(userFromDB);

    return {
      message: 'User information from Google',
      user,
      jwt: jwtToken,
    };
  }
}

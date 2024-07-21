import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IUser } from '../interfaces/user.interface';

/**
 * JWT Authentication Strategy.
 *
 * This strategy uses Passport.js and the JWT strategy to authenticate
 * users based on JSON Web Tokens (JWT). It extracts the token from the
 * request, verifies it, and uses the payload to retrieve and validate
 * the user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs the JwtStrategy instance.
   *
   * @param configService - Service to access configuration values
   * @param authService - Service to handle authentication-related operations
   */
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates the JWT payload and retrieves the user.
   *
   * @param payload - The decoded JWT payload, which includes user information
   * @returns The user object if valid, otherwise throws UnauthorizedException
   * @throws UnauthorizedException if the user is not found
   */
  async validate(payload: any): Promise<IUser> {
    const user = await this.authService.validateUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    return user;
  }
}

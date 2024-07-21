import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

/**
 * Strategy for Google OAuth 2.0 authentication.
 *
 * This strategy uses Passport.js and the Google OAuth 2.0 strategy to authenticate
 * users via Google. It configures the strategy with credentials and scopes,
 * and processes user information from Google upon successful authentication.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  /**
   * Constructs the GoogleStrategy instance.
   *
   * @param configService - Service to access configuration values
   */
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      // callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  /**
   * Validates and processes the user information from Google.
   *
   * @param accessToken - OAuth 2.0 access token provided by Google
   * @param refreshToken - OAuth 2.0 refresh token provided by Google
   * @param profile - User profile information from Google
   * @param done - Callback to be invoked once validation is complete
   * @returns A Promise that resolves with the user information
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    // Construct the user object with relevant information
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    // Pass the user object to the `done` callback
    done(null, user);
  }
}

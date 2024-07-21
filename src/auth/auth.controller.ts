import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

/**
 * Controller for handling authentication-related routes.
 *
 * Provides endpoints for Google authentication via OAuth 2.0 and handles
 * the login process using Google tokens.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Initiates Google authentication.
   *
   * This route triggers the Google OAuth 2.0 authentication process.
   * It redirects the user to Google's login page.
   *
   * @returns The result of the authentication process handled by the `AuthGuard`.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  /**
   * Handles the Google OAuth 2.0 callback.
   *
   * This route is called by Google after a user logs in and grants permissions.
   * It processes the callback, retrieves the user information, and performs
   * login or registration.
   *
   * @param req - The request object containing user information from Google
   * @param res - The response object for redirecting the user
   * @returns The result of the login process handled by `AuthService`
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // Pass the request to the authService to handle login
    await this.authService.googleLogin(req);
    // Redirect or handle the result as needed
    res.redirect('/dashboard'); // Example redirection
  }

  /**
   * Handles Google authentication via POST request.
   *
   * This route accepts an ID token from Google, verifies it, and generates
   * a JWT token for the user.
   *
   * @param idToken - The ID token provided by Google after user authentication
   * @returns The result of the login process handled by `AuthService`
   */
  @Post('google')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async googleAuthRedirectPost(@Body('idToken') idToken: string) {
    // Pass the ID token to the authService to handle login and JWT generation
    return this.authService.googleLogin(idToken);
  }
}

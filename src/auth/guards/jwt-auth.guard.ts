import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard.
 *
 * This guard is responsible for handling JWT authentication.
 * It extends the AuthGuard from @nestjs/passport with the 'jwt' strategy.
 * This means it will use the 'jwt' strategy defined in your Passport setup
 * to validate JWT tokens and ensure that requests are authenticated.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // No additional implementation needed here;
  // The base AuthGuard class already provides the necessary functionality.
}

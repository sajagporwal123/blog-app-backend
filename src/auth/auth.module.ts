import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './schemas/user.schema';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from './user.service';

/**
 * Module for handling authentication.
 *
 * This module includes configuration for JWT authentication, Google OAuth 2.0,
 * and user management. It sets up the necessary providers, controllers,
 * and imports required for authentication functionality.
 */
@Module({
  imports: [
    /**
     * Mongoose module configuration for the User schema.
     * Connects to the MongoDB database and registers the User schema.
     */
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),

    /**
     * Passport module configuration.
     * Sets 'jwt' as the default strategy for authentication.
     */
    PassportModule.register({ defaultStrategy: 'jwt' }),

    /**
     * JWT module configuration.
     * Uses async registration to fetch secret and expiration options from the ConfigService.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // Adjust token expiration as needed
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    /**
     * AuthController handles authentication routes and logic.
     */
    AuthController,
  ],
  providers: [
    AuthService,
    GoogleStrategy, // GoogleStrategy handles Google OAuth 2.0 authentication.
    JwtStrategy, // JwtStrategy handles JWT-based authentication.
    UserService,
    ConfigService,
  ],
  exports: [
    /**
     * Export PassportModule and JwtModule to make them available in other modules.
     */
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}

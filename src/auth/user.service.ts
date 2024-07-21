import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'; // Import CreateUserDto
import { IUser } from './interfaces/user.interface'; // Import IUser interface

/**
 * Service for managing user-related operations.
 *
 * Provides methods to find users by ID or email, create new users,
 * and handle user retrieval or creation based on a profile.
 */
@Injectable()
export class UserService {
  /**
   * Constructs the UserService instance.
   *
   * @param userModel - Mongoose model for the User schema
   */
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  /**
   * Retrieves a user by their ID.
   *
   * @param id - The ID of the user to retrieve
   * @returns The user object or null if not found
   */
  async findById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Retrieves a user by their email.
   *
   * @param email - The email of the user to retrieve
   * @returns The user object or null if not found
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Creates a new user in the database.
   *
   * @param userDto - The data transfer object containing user details
   * @returns The created user object
   */
  async create(userDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  /**
   * Finds a user by their email or creates a new user if not found.
   *
   * @param profile - The user profile obtained from an external source (e.g., Google)
   * @returns The existing or newly created user object
   */
  async findOrCreate(profile: any): Promise<IUser> {
    let user = await this.findByEmail(profile.email);

    if (!user) {
      // Create a new user if not found
      const newUserDto: CreateUserDto = {
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      };
      user = await this.create(newUserDto);
    }

    return user;
  }
}

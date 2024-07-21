import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a User document in the MongoDB database.
 * Extends the Mongoose Document interface to include Mongoose-specific methods.
 */
export type UserDocument = User & Document;

/**
 * Mongoose schema for the User model.
 *
 * Defines the structure of user documents in the MongoDB database.
 */
@Schema()
export class User {
  /**
   * The user's email address.
   * This field is required and must be unique across all user documents.
   */
  @Prop({ required: true, unique: true })
  email: string;

  /**
   * The user's name.
   * This field is required for each user document.
   */
  @Prop({ required: true })
  name: string;

  /**
   * The URL of the user's profile picture.
   * This field is optional.
   */
  @Prop()
  picture?: string;
}

// Create the Mongoose schema for the User model
export const UserSchema = SchemaFactory.createForClass(User);

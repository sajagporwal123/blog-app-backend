import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

/**
 * Blog document type that extends Mongoose's Document interface.
 */
export type BlogDocument = Blog & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Blog {
  /**
   * The title of the blog.
   *
   * Required field.
   */
  @Prop({ required: true })
  title: string;

  /**
   * The content of the blog.
   *
   * Required field.
   */
  @Prop({ required: true })
  content: string;

  /**
   * Reference to the user who created the blog.
   *
   * Required field and references the User schema.
   */
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId; // Use Types.ObjectId for proper type inference

  /**
   * The date when the blog was created.
   *
   * Automatically managed by Mongoose if `timestamps` is enabled.
   */
  @Prop({ default: Date.now })
  createdAt: Date;
}

// Create the Mongoose schema for the Blog class
export const BlogSchema = SchemaFactory.createForClass(Blog);

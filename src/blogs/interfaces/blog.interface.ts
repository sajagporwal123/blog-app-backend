import { Document } from 'mongoose';

export interface IBlog extends Document {
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly user: string;
  readonly _id?: string;
}

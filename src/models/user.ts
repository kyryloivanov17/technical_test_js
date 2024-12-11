import mongoose, { Document, Schema } from 'mongoose';
import { handleMongooseError } from '../middlewares';

export interface User extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date; 
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

export const UserModel = mongoose.model<User>('User', userSchema);

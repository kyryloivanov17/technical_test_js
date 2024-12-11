// src/models/Recommendation.ts

// TODO: Define the Mongoose schema and model for storing recommendations.

// Hints:
// - Define a schema that includes:
//   - `userRef`: string
//   - `suggestions`: string[]
// - Create a TypeScript interface for type safety (without using the 'I' prefix).
// - Export the Mongoose model to be used in other parts of your application.


import mongoose, { Document, Schema } from 'mongoose';
import { handleMongooseError } from '../middlewares';

export interface Recommendation extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user who created the recommendation
  recommendations: string[];           
  createdAt: Date;
  updatedAt: Date; 
}

const recommendationSchema = new Schema<Recommendation>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recommendations: {
      type: [String],
      required: [true, 'Recommendations are required'],
    },
  },
  { versionKey: false, timestamps: true }
);

recommendationSchema.post('save', handleMongooseError);

export const RecommendationModel = mongoose.model<Recommendation>('Recommendation', recommendationSchema);

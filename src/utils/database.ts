// src/utils/database.ts

// TODO: Set up the database connection.

// Hints:
// - Use Mongoose to connect to your MongoDB instance.
// - Create a function to initialize the connection.
// - Use environment variables or a configuration file for the connection URI.

// Example (from a different context):


import mongoose from 'mongoose';

const DATABASE_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/my-database';

export const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

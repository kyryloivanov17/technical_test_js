// src/controllers/usersController.ts

/**
 * TODO: Implement this controller function.
 *
 * Steps:
 * 1. Extract `clientId` from `req.params`.
 * 2. Retrieve the promotions for the given `clientId` from the database.
 * 3. If promotions exist, return them in the response.
 * 4. If not, return a 404 error with an appropriate message.
 *
 * Handle exceptions and errors appropriately.
 *
 * Hints:
 * - Use `PromotionModel` to query the database.
 * - Use try-catch blocks to handle exceptions.
 */

import { Request, Response } from 'express';
import { RecommendationModel } from '../models/recommendation';
import { UserModel } from '../models/user';

export const createUser = async (req: Request, res: Response) => { 
  try {
    const newUser = await UserModel.create(req.body);
    if (!newUser) {
      return res.status(400).json({
        error: 'Unable to create user',
      });
    }
    res.json(newUser);
  } catch (error) {
    res.status(400).json({
      error: 'Unable to create user',
    });
  }
}

export const getUserRecommendations = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const recommendations = await RecommendationModel.find({ user: user._id });

    if (!recommendations || recommendations.length === 0) {
      return res.status(404).json({
        error: `No recommendations found for user ${user_id}.`,
      });
    }

    res.status(200).json({
      user_id,
      recommendations,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      error: 'Unable to fetch recommendations at this time. Please try again later.',
    });
  }
};


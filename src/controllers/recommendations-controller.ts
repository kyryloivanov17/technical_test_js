// src/controllers/recommendationsController.ts

/**
 * TODO: Implement this controller function.
*
* Steps:
* 1. Extract `clientId` and `productInterests` from the request body.
* 2. Validate the input data.
*    - Ensure `clientId` is a non-empty string.
*    - Ensure `productInterests` is a non-empty array of non-empty strings.
* 3. Interact with an external API to get tailored promotions.
*    - Send a POST request to the external promotions API.
*    - Include the `productInterests` in the request payload.
* 4. Save the promotions in the database.
*    - Use the `PromotionModel` to store data.
* 5. Return the promotions in the response.
   *
   * Handle exceptions and errors appropriately.
   *
   * Hints:
   * - Use an HTTP client like `axios` or `node-fetch` for external requests.
   * - Anticipate possible errors from the external service and the database.
   * - Use try-catch blocks for error handling.
*/

import { Request, Response } from 'express';
import { getRecommendations } from '../utils/getRecommendations';
import { RecommendationModel } from '../models/recommendation';
import { getCache, setCache } from '../utils/cache';
import { UserModel } from '../models/user';


const createCacheKey = (user_id: string, preferences: string[]): string => {
  return `recommendations_${user_id}_${JSON.stringify(preferences)}`;
};

export const generateRecommendations = async (req: Request, res: Response) => {
  const { user_id, preferences } = req.body;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing user_id' });
  }
  if (!Array.isArray(preferences) || preferences.length === 0) {
    return res.status(400).json({ error: 'Preferences must be a non-empty array of strings' });
  }

  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const cacheKey = createCacheKey(user_id, preferences);

    const cachedRecommendations = getCache(cacheKey);

    if (cachedRecommendations) {
      return res.json({
        source: 'cache',
        recommendations: cachedRecommendations,
      });
    }

    const response = await getRecommendations(preferences);

    await RecommendationModel.create({ user: user._id, recommendations: response?.recommendations });

    const savedRecommendations = await RecommendationModel.find({ user: user_id });

    setCache(cacheKey, savedRecommendations);

    res.json({
      source: 'database',
      recommendations: savedRecommendations,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      error: 'Unable to generate recommendations at this time. Please try again later.',
    });
  }
};

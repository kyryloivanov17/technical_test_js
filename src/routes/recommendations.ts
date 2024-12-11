// src/routes/recommendations.ts


/**
 * TODO: Set up the `/recommendations` POST route.
*
* Steps:
* 1. Apply validation middleware to validate the request body.
* 2. Use the `generateRecommendations` controller to handle the request.
* 3. Handle validation errors appropriately.
*
* Hints:
* - Use `express-validator` for input validation.
* - Use `validationResult` to check for validation errors.
*/


import { Router } from 'express';
import { generateRecommendations } from '../controllers/recommendations-controller';
import { validateBody } from '../middlewares/validateBody';
import { recommendationValidationSchema } from '../utils/schemas';

const router = Router();

router.post('/', validateBody(recommendationValidationSchema), generateRecommendations);
 

export default router;

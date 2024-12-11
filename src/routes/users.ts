// src/routes/users.ts

/**
 * TODO: Set up the `/users/:userRef/recommendations` GET route.
 *
 * Steps:
 * 1. Use the `getUserRecommendations` controller to handle the request.
 * 2. Ensure the `userRef` parameter is extracted correctly.
 * 3. Handle any errors appropriately.
 *
 * Hints:
 * - No additional validation middleware is required unless you want to validate `userRef`.
 */

import { Router } from 'express';
import { getUserRecommendations, createUser } from '../controllers/users-controller';
import { validateBody } from '../middlewares/validateBody';
import { userValidationSchema } from '../utils/schemas';

const router = Router();
 
router.get('/:user_id/recommendations', getUserRecommendations);
router.post('/', validateBody(userValidationSchema), createUser);
 

export default router;

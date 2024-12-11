// src/utils/schemas.ts

// TODO: Define request and response validation schemas.

// Hints:
// - Use `express-validator` to create validation chains for incoming requests.
// - For the `/promotions` endpoint:
//   - Validate that `clientId` is a non-empty string.
//   - Validate that `productInterests` is a non-empty array of non-empty strings.
// - Define TypeScript interfaces for type checking if needed.

// Example interfaces and validation chains (for candidate to use):

import Joi from 'joi';

const userValidationSchema = Joi.object({
  name: Joi.string().required(),
});

const recommendationValidationSchema = Joi.object({
  user_id: Joi.string()
    .required()
    .messages({
      'string.empty': 'User id cannot be empty',
      'string.pattern.base': 'User id must be a valid ObjectId',
      'any.required': 'User id is required',
    }),
  preferences: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one suggestion is required',
      'array.includesRequiredUnknowns': 'Each preference must be a valid string',
      'any.required': 'Preferences are required',
    }),
});

export { userValidationSchema, recommendationValidationSchema };
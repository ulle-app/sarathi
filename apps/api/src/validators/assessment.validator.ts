import { body, ValidationChain } from 'express-validator';

export const responsesValidator: ValidationChain[] = [
  body('responses')
    .isArray()
    .withMessage('Responses must be an array')
    .notEmpty()
    .withMessage('Responses cannot be empty'),

  body('responses.*.questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isString()
    .withMessage('Question ID must be a string'),

  body('responses.*.value')
    .exists()
    .withMessage('Response value is required'),

  body('responses.*.timeSpentSeconds')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive integer'),
];

export const assessmentTypeValidator: ValidationChain[] = [
  body('type')
    .optional()
    .isIn(['personality', 'aptitude', 'interest', 'skill'])
    .withMessage('Invalid assessment type'),
];

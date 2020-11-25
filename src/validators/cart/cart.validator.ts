import * as Joi from 'joi';

export const cartValidator = Joi.object({
  loan_time: Joi.number().min(1).max(10).required()
});

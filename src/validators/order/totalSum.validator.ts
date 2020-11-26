import * as Joi from 'joi';

export const totalSumValidator = Joi.object({
  total_sum: Joi.number().min(1).required()
});

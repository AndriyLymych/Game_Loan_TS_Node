import * as Joi from 'joi';

export const blockPeriodValidator = Joi.object({
  period: Joi.number().min(1).required()
});

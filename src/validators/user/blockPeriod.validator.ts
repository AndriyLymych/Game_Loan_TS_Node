import * as Joi from 'joi';

export const blockPeriodValidator = Joi.object({
  blockPeriod: Joi.number().min(1).required()
});

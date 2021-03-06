import * as Joi from 'joi';

export const unauthorizedOrderValidator = Joi.object({
  email: Joi.string().email().min(4).max(60).trim().required(),
  phone: Joi.string().trim().min(10).max(13).required(),
  name: Joi.string().min(5).max(80).required()
});

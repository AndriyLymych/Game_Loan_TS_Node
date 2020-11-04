import * as Joi from 'joi';

export const loginUserValidator = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).max(120).required()

});

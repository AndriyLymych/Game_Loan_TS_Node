import * as Joi from 'joi';

export const emailValidator = Joi.object({
  email: Joi.string().trim().email().required()
});

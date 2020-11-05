import * as Joi from 'joi';

export const resetPasswordValidator = Joi.object({
  password: Joi.string().trim().min(8).max(120).required(),
  passwordAgain: Joi.string().trim().min(8).max(120).required()
});

import * as Joi from 'joi';

export const changePasswordValidator = Joi.object({
  password: Joi.string().trim().min(8).max(120).required(),
  newPassword: Joi.string().trim().min(8).max(120).required(),
  newPasswordAgain: Joi.string().trim().min(8).max(120).required()
});

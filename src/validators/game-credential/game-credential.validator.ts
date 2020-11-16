import * as Joi from 'joi';

export const gameCredentialValidator = Joi.object({
  login: Joi.string().email().required(),
  password: Joi.string().min(5).max(60).required(),
  gameId: Joi.string().required()
});

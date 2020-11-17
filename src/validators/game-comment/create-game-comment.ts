import * as Joi from 'joi';

export const createGameCommentValidator = Joi.object({
  comment: Joi.string().min(1).required(),
  rate: Joi.number().min(0).max(5)
});

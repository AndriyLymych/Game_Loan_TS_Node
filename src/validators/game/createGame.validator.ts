import * as Joi from 'joi';

export const createGameValidator = Joi.object({
  title: Joi.string().min(2).required(),
  photos: Joi.array().items(Joi.string()),
  description: Joi.string().min(2).required(),
  version: Joi.array().items(Joi.object({
    type: Joi.string().min(2).required(),
    price: Joi.number().min(1).required()
  })),
  genre: Joi.string().trim().min(2).required(),
  size: Joi.number().min(1)
});

import * as Joi from 'joi';

export const editGameValidator = Joi.object({
    title: Joi.string().min(2).required(),
    description: Joi.string().min(2).required(),
    version: Joi.string().min(2).required(),
    price: Joi.number().min(1).required(),
    status:Joi.string().trim().min(2),
    genre: Joi.array().items([Joi.string().trim().min(2).required()]),
    size: Joi.number().min(1)
});

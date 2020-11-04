import * as Joi from 'joi';
import {RegExpEnum, UserGenderEnum} from '../../constant';

export const createUserValidator = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).max(120).required(),
  photo: Joi.string(),
  name: Joi.string().trim().min(2).max(25).required(),
  surname: Joi.string().trim().min(2).max(50).required(),
  age: Joi.number().integer().min(1).max(110),
  phone: Joi.string().regex(RegExpEnum.phone).trim(),
  gender: Joi.string().trim().allow(UserGenderEnum.MALE, UserGenderEnum.FEMALE)
});

import * as Joi from 'joi';
import {RegExpEnum, UserGenderEnum} from '../../constant';

export const updateUserValidator = Joi.object({
  name: Joi.string().trim().min(2).max(25).required(),
  surname: Joi.string().trim().min(2).max(50).required(),
  age: Joi.number().integer().min(1).max(110),
  phone: Joi.string().regex(RegExpEnum.phone).trim(),
  gender: Joi.string().trim().allow(UserGenderEnum.MALE, UserGenderEnum.FEMALE)
});

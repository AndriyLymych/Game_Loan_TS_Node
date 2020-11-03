import * as Joi from 'joi';
import {RegExpEnum} from '../../constant';

export const loginUserValidator = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().regex(RegExpEnum.password).required()

});

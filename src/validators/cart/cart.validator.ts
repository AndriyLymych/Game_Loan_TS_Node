import * as Joi from 'joi';
import {GameVersionEnum} from '../../constant/game';

export const cartValidator = Joi.object({
  loan_time: Joi.number().min(1).max(10),
  type: Joi.string().min(2).max(2).allow(GameVersionEnum).required()
});

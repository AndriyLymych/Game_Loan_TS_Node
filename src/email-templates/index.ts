import {TokenActionEnum} from '../constant';

export const htmlTemplates: {[index: string]: {subject: string, templateFileName: string}} = {
  [TokenActionEnum.REGISTER_USER]: {
    subject: 'Ласкаво просимо',
    templateFileName: 'confirm-user'
  },
  [TokenActionEnum.RESET_PASSWORD]: {
    subject: 'Співчуваємо',
    templateFileName: 'forgot-password'
  }
};

import {EmailActions,TokenActionEnum} from '../constant';

export const htmlTemplates: { [index: string]: { subject: string, templateFileName: string } } = {
  [TokenActionEnum.REGISTER_USER]: {
    subject: 'Ласкаво просимо',
    templateFileName: 'confirm-user'
  },
  [TokenActionEnum.RESET_PASSWORD]: {
    subject: 'Забули пароль',
    templateFileName: 'forgot-password'
  },
  [EmailActions.SEND_CREDENTIALS]: {
    subject: 'Дані входу в акаунт',
    templateFileName: 'send-game-credentials'
  }
};

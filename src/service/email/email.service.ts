import {createTransport} from 'nodemailer';
import * as path from 'path';

import * as EmailTemplates from 'email-templates';
import {ResponseStatusCodeEnum, TokenActionEnum} from '../../constant';
import {config} from '../../config';
import {htmlTemplates} from '../../email-templates';
import {ErrorHandler} from '../../errors';

if (
  !config.FRONTEND_URL
    || !config.ROOT_EMAIL_SERVICE
    || !config.ROOT_EMAIL
    || !config.ROOT_EMAIL_PASSWORD
) {
  throw Error('Root email credentials are not defined!');
}

const contextExtension = {
  frontendUrl: config.FRONTEND_URL
};

const transporter = createTransport({
  service: config.ROOT_EMAIL_SERVICE,
  auth: {
    user: config.ROOT_EMAIL,
    pass: config.ROOT_EMAIL_PASSWORD
  }
});

const emailTemplates = new EmailTemplates({
  message: {},
  views: {
    root: path.resolve(__dirname, '../../', 'email-templates')
  }
});

export class MailService {
  async sendEmail(email: string, action: TokenActionEnum, context: any = {}): Promise<void> {
    const templateInfo = htmlTemplates[action];

    if (!templateInfo) {
      throw new ErrorHandler(ResponseStatusCodeEnum.SERVER_ERROR, 'Template not found (');
    }

    Object.assign(context, contextExtension);

    const html = await emailTemplates.render(templateInfo.templateFileName, context);

    await transporter.sendMail({
      from: `NOREPLY <${config.ROOT_EMAIL}>`,
      to: email,
      subject: templateInfo.subject,
      html
    });
  }
}

export const emailService = new MailService();

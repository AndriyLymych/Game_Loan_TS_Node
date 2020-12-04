export const config = {
  PORT: process.env.PORT || 5000,
  HOST: process.env.PORT || 'http://localhost:',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',

  CRON_JOB_PERIOD: process.env.CRON_JOB_PERIOD || '0 0 * * *',

  JWT_ACCESS_SECRET: process.env.JWT_SECRET || 'hjsvsjhsdfohio$5asdn*dsjklvkljs',
  ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME || '10d',

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '2kldhkhlshldshl&&7fshdsasags',
  REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME || 1000 * 60 * 60 * 24 * 30,

  JWT_CONFIRM_REGISTER_SECRET: process.env.JWT_CONFIRM_EMAIL_SECRET || 'lhdshdghdhhshsdhophosd@dhpodhodg77ergh',
  JWT_CONFIRM_REGISTER_LIFETIME: process.env.JWT_CONFIRM_EMAIL_LIFETIME || '15m',

  JWT_PASS_RESET_SECRET: process.env.JWT_PASS_RESET_SECRET || 'sdghhidsghiydshidsghigdshiopdsg877&&8grghogr',
  JWT_PASS_RESET_LIFETIME: process.env.JWT_PASS_RESET_LIFETIME || '24h',

  serverRateLimits: {
    period: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  },

  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/game_loan',

  ROOT_EMAIL: process.env.ROOT_EMAIL || 'playstationgameloan@gmail.com',
  ROOT_EMAIL_PASSWORD: process.env.ROOT_EMAIL_PASSWORD || '2000maxat',
  GLOBAL_ADMIN_NAME: process.env.GLOBAL_ADMIN_NAME || 'Андрій',
  GLOBAL_ADMIN_SURNAME: process.env.GLOBAL_ADMIN_SURNAME || 'Лимич',
  GLOBAL_ADMIN_AGE: process.env.GLOBAL_ADMIN_AGE || 26,
  GLOBAL_ADMIN_PHONE: process.env.GLOBAL_ADMIN_PHONE || '+380960985253',
  ROOT_EMAIL_SERVICE: process.env.ROOT_EMAIL_SERVICE || 'gmail',
  CLEAN_HISTORY_TIME: process.env.CLEAN_HISTORY_TIME || 1000 * 60 * 60 * 24 * 7 * 4,
  CRON_PERIOD_FOR_SEND_MSG_ABOUT_LOAN_FINISH: process.env.CRON_PERIOD_FOR_SEND_MSG_ABOUT_LOAN_FINISH || '0 */4 * * *',
  CRON_PERIOD_FOR_CLEAN_HISTORY: process.env.CRON_PERIOD_FOR_CLEAN_HISTORY || '0 0 * * SUN',
  CRON_PERIOD_FOR_CLEAN_AUTH_TOKENS: process.env.CRON_PERIOD_FOR_CLEAN_AUTH_TOKENS || '0 */4 * * *',
  CRON_PERIOD_FOR_UNLOCK_USERS: process.env.CRON_PERIOD_FOR_UNLOCK_USERS || '0 */5 * * *',

  GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID || '221200163420-bcocn8434qlsn03bemi1gmd2gvitg20h.apps.googleusercontent.com',
  GOOGLE_SECRET_KEY : process.env.GOOGLE_SECRET_KEY || 'MGKQden6GTjufOkk3ymz8aCV',
  FACEBOOK_APP_ID : process.env.FACEBOOK_APP_ID || '717322315863846',
  FACEBOOK_APP__SECRET : process.env.FACEBOOK_APP__SECRET || 'f2f02d9aa612ac641b339937a9d14a41'
};

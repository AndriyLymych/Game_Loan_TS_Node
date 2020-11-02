export const customErrors = {
  // 400
  BAD_REQUEST_USER_REGISTERED: {
    message: 'User is already registered',
    code: 4001
  },
  BAD_REQUEST_USER_ACTIVATED: {
    message: 'User is already active',
    code: 4002
  },

  BAD_REQUEST_NO_TOKEN: {
    message: 'Token is not present'
  },

  //401
  UNAUTHORIZED_BAD_TOKEN: {
    message: 'Something wrong with token'
  },

  //403
  FORBIDDEN_USER_NOT_CONFIRMED: {
    message: 'User is not confirmed',
    code: 4031
  },
  FORBIDDEN_WRONG_TOKEN_ACTION: {
    message: 'Action for token is not correct',
    code: 4032
  },
  FORBIDDEN_VALIDATION_ERROR: {
    code: 4033
  },

  // 404
  NOT_FOUND: {
    message: 'Record not found'

  }
};

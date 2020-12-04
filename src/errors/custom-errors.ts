export const customErrors = {
  // 400
  BAD_REQUEST_USER_REGISTERED: {
    message: 'User is already registered',
    code: 4001
  },
  BAD_REQUEST_USER_IS_ALREADY_ACTIVE: {
    message: 'User is already active',
    code: 4002
  },
  BAD_REQUEST_USER_IS_NOT_CONFIRMED: {
    message: 'User is not confirmed',
    code: 4003
  },
  BAD_REQUEST_USER_IS_NOT_PRESENT: {
    message: 'User is not present',
    code: 4004
  },
  BAD_REQUEST_USER_IS_BLOCKED: {
    message: 'User is blocked',
    code: 4005
  },
  BAD_REQUEST_USER_IS_ALREADY_BLOCKED: {
    message: 'User is already blocked',
    code: 4006
  },
  BAD_REQUEST_USER_NOT_FOUND: {
    message: 'User is not found',
    code: 4007
  },
  BAD_REQUEST_GAME_IS_NOT_FOUND: {
    message: 'Game is not found',
    code: 4008
  },
  BAD_REQUEST_CREDENTIALS_IS_ALREADY_EXISTS: {
    message: 'Credentials is already exists',
    code: 4009
  },
  BAD_REQUEST_CREDENTIALS_IS_NOT_FOUND: {
    message: 'Credentials is not found',
    code: 40010
  },
  BAD_REQUEST_NO_CREDENTIAL_RECORDS: {
    message: 'No credential records',
    code: 40011
  },
  BAD_REQUEST_NO_COMMENTS: {
    message: 'No comments',
    code: 40012
  },
  BAD_REQUEST_COMMENT_IS_NOT_PRESENT: {
    message: 'Comment is not present',
    code: 40013
  },
  BAD_REQUEST_GAME_ALREADY_PRESENT_IN_CART: {
    message: 'Game is already present in cart',
    code: 40014
  },
  BAD_REQUEST_CART_IS_NOT_EXISTS: {
    message: 'Cart is not exists',
    code: 40015
  },
  BAD_REQUEST_GAME_IS_NOT_AVAILABLE_NOW: {
    message: 'Game is not available now',
    code: 40016
  },
  BAD_REQUEST_GAME_IS_NOT_PRESENT_IN_CART: {
    message: 'Game is not present in cart',
    code: 40017
  },
  BAD_REQUEST_ORDER_IS_NOT_EXISTS: {
    message: 'Order is not exists',
    code: 40018
  },
  BAD_REQUEST_ORDER_IS_ALREADY_ADMITTED: {
    message: 'Order is already admitted',
    code: 40019
  },
  BAD_REQUEST_ORDER_IS_ALREADY_REJECTED: {
    message: 'Order is already rejected',
    code: 40020

  },
  BAD_REQUEST_ORDER_IS_ALREADY_FINISHED: {
    message: 'Order is already finished',
    code: 40021
  },
  BAD_REQUEST_NO_ANY_ORDERS: {
    message: 'No any orders',
    code: 40022
  },
  BAD_REQUEST_NO_SUCH_GAME_IN_ORDER: {
    message: 'No such game in order',
    code: 40023
  },

  //401
  UNAUTHORIZED_TOKEN_NOT_PRESENT: {
    message: 'Token is not present',
    code: 4011
  },
  UNAUTHORIZED_BAD_TOKEN: {
    message: 'Token is not valid',
    code: 4012
  },
  BAD_REQUEST_FACEBOOK_AUTH:{
    message:'No user from facebook',
    code:40013
  },
  BAD_REQUEST_GOOGLE_AUTH:{
    message:'No user from google',
    code:40014
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
  FORBIDDEN_YOU_ARE_NOT_ADMIN: {
    message: 'You are not admin',
    code: 4034
  },
  FORBIDDEN_YOU_CANT_BLOCK_YOURSELF: {
    message: 'You cant block yourself',
    code: 4035
  },
  FORBIDDEN_WRONG_PASSWORD: {
    message: 'Wrong password',
    code: 4036
  },
  FORBIDDEN_PASSWORDS_NOT_EQUAL: {
    message: 'Passwords not equal',
    code: 4037
  },
  FORBIDDEN_PASSWORD_EQUAL_OLD_PASSWORD: {
    message: 'Password match to old password',
    code: 4038
  },
  FORBIDDEN_YOU_CANT_DELETE_COMMENT: {
    message: 'You cant delete this comment',
    code: 4039
  },

  // 404
  NOT_FOUND: {
    message: 'Record not found'

  }
};

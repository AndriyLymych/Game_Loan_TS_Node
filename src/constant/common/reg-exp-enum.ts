export const RegExpEnum = {
  password: new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
  phone: new RegExp('^[+]*[0-9]{5,20}$')
};

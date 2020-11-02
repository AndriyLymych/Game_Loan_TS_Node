import {compare, hash} from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => hash(password, 10);
export const comparePassword = (password: string, hashedPassword: string): Promise<boolean> => compare(password, hashedPassword);

import CryptoJS from 'crypto-js';

import { User } from '@/types';

export interface Tokens {
  accessToken?: string;
  refreshToken?: string;
}

export type TokenKey = 'accessToken' | 'refreshToken';

const userKey = 'user';
const accessTokenKey: TokenKey = 'accessToken';
const refreshTokenKey: TokenKey = 'refreshToken';
const tokenKeys: TokenKey[] = [accessTokenKey, refreshTokenKey];

export const clearTokens = () =>
  tokenKeys.forEach((tokenKey) => localStorage.removeItem(tokenKey));

export const clearUser = () => localStorage.removeItem(userKey);

export const clearAll = () => {
  clearTokens();
  clearUser();
};

export const saveToken = (tokenKey: TokenKey, token: string) =>
  localStorage.setItem(
    tokenKey,
    CryptoJS.AES.encrypt(token, process.env.NEXT_PUBLIC_CRYPTO_KEY!).toString()
  );

export const saveTokens = ({ accessToken, refreshToken }: Tokens) => {
  if (accessToken) {
    saveToken('accessToken', accessToken);
  }
  if (refreshToken) {
    saveToken('refreshToken', refreshToken);
  }
};

export const getToken = (tokenKey: TokenKey = accessTokenKey) => {
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    return;
  }

  try {
    return CryptoJS.AES.decrypt(
      token,
      process.env.NEXT_PUBLIC_CRYPTO_KEY!
    ).toString(CryptoJS.enc.Utf8);
  } catch {
    clearAll();
  }
};

export const decryptToken = (token: string) =>
  CryptoJS.AES.decrypt(token, process.env.NEXT_PUBLIC_CRYPTO_KEY!).toString(
    CryptoJS.enc.Utf8
  );

export const saveUser = (user: User) =>
  localStorage.setItem(userKey, JSON.stringify(user));

export const getUser = (): User | undefined => {
  const user = localStorage.getItem(userKey);
  if (!user) {
    return undefined;
  }
  return JSON.parse(user);
};

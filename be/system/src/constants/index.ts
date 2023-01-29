import ms from 'ms';

export const TEN_MINUTES = 10 * 60000;
export const THREE_DAYS = ms('3 days');

export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

export const AUTH_TYPES = {
  BEARER: 'Bearer',
  DIGEST: 'Digest',
  BASIC: 'Basic',
};

export enum LOGIN_METHOD {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  ACC = 'acc',
}

export enum METHOD_ACTION {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

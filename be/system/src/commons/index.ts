import jwt from 'jsonwebtoken';
import { TEN_MINUTES, THREE_DAYS, TOKEN_TYPES } from '../constants';
import { tokenRepo } from '../models';

export const generateToken = async (id: number, isRefresh = false) => {
  const tokenIat = Date.now() + TEN_MINUTES;
  const token = jwt.sign(
    {
      userId: id,
      iat: tokenIat,
      type: TOKEN_TYPES.ACCESS,
    },
    process.env.SECRET_TOKEN,
    {
      algorithm: 'HS256',
    }
  );

  if (isRefresh) {
    return { token: { data: token, iat: tokenIat } };
  }

  const rTokenIat = Date.now() + THREE_DAYS;
  const refreshToken = jwt.sign(
    {
      userId: id,
      iat: rTokenIat,
      type: TOKEN_TYPES.REFRESH,
    },
    process.env.SECRET_TOKEN,
    {
      algorithm: 'HS256',
    }
  );

  await tokenRepo.insert({ refreshToken, iat: rTokenIat, userId: id });

  return {
    token: { data: token, iat: tokenIat },
    refreshToken: { data: refreshToken, iat: rTokenIat },
  };
};

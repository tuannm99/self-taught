import { Response } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

export const buildResponseMessage = async (
  status: number,
  res: Response,
  data: Array<any> | object,
  paging?: any
) => {
  const response: {
    data: object | any[];
    code: number;
    msg: string;
    paging?: object;
  } = {
    data: data,
    code: status,
    msg: httpStatus[status],
  };

  if (paging) {
    response.paging = paging;
  }
  res.status(status).json(response);
};

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const hashStr = async (data: string, salt: string) => {
  return await bcrypt.hash(data, salt);
};

export const isHashedMatch = async (data: string, hash: string) => {
  return await bcrypt.compare(data, hash);
};

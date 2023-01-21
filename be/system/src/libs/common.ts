import { Response } from 'express';
import httpStatus from 'http-status';

export const buildResponseMessage = async (
  res: Response,
  data: Array<any> | object,
  status: number,
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

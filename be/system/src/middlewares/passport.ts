import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  VerifyFunctionWithRequest,
} from 'passport-http-bearer';
import { ApiError } from '../libs/exception';

passport.use(
  'jwt',
  new JwtStrategy(
    { passReqToCallback: true },
    (...[req, token, done]: Parameters<VerifyFunctionWithRequest>) => {
      // for check casl
      const { functionId, action } = req.body;
      console.log(functionId, action);

      if (token !== 'foo') {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong Token');
      }

      const verified: any = jwt.verify(token, 'secret');

      console.log(Date.now());
      if (verified.iat <= Date.now()) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Token Expried');
      }

      return done(null, {}, { scope: 'user' });
    }
  )
);

export default passport;

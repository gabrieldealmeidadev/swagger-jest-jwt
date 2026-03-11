import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { verify } from 'jsonwebtoken';
import { TokenPayload } from '../types/TokenPayload';

export const AuthMiddlewares = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return response.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');

    const decoded = verify(token, process.env.secret as string);
    const { id } = decoded as TokenPayload;

    request.userId = id;
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Token invalid' });
  }
};

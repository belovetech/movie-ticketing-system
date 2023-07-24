import { Request, Response, NextFunction } from 'express';
import { Exception } from '@exceptions';
import logger from '@utils/logger';

function errorMiddleware(err: Exception, req: Request, res: Response, next: NextFunction) {
  try {
    const statusCode: number = err.statusCode || 500;
    let message: string = err.message || 'Internal Server Error';
    const name: string = err.name || 'InternalServerError';

    logger.info(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, message:: ${message}`);

    if (err.name === 'ValidationException') {
      const parsedMessage = JSON.parse(message);
      return res.status(statusCode).json({ statusCode, name, ...parsedMessage });
    }

    // console.log(err);

    return res.status(statusCode).json({ statusCode, name, error: message });
  } catch (error) {
    return next(error);
  }
}

export default errorMiddleware;
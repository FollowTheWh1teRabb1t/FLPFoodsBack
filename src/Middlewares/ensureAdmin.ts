import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Utils/AppError';

export const ensureAdmin = (request: Request, response: Response, next: NextFunction) => {
    if(request.user?.role !== 'admin') {
        throw new AppError('Acesso restrito a administradores', 403)
    }

    return next();
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  });
};

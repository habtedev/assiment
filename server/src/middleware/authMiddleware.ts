
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
    isStudent?: boolean;
    isTeacher?: boolean;
  };
}

interface JwtUserPayload extends jwt.JwtPayload {
  userId: number;
  role: string;
  isStudent?: boolean;
  isTeacher?: boolean;
}
export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  console.log('[AUTH] Headers:', req.headers);
  console.log('[AUTH] Cookies:', req.cookies);
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('[AUTH] Token from Authorization header:', token);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('[AUTH] Token from cookie:', token);
  } else {
    console.log('[AUTH] No token found in headers or cookies');
  }

  if (!token) {
    console.log('[AUTH] No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.log('[AUTH] JWT secret not configured');
    return res.status(500).json({ error: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    console.log('[AUTH] Decoded JWT:', decoded);

    const user: {
      userId: number;
      role: string;
      isStudent?: boolean;
      isTeacher?: boolean;
    } = {
      userId: decoded.userId,
      role: decoded.role,
    };

    if (decoded.isStudent !== undefined) {
      user.isStudent = decoded.isStudent;
    }
    if (decoded.isTeacher !== undefined) {
      user.isTeacher = decoded.isTeacher;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('[AUTH] JWT verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };
}

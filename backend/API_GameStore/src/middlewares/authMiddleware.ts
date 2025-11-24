import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Chave secreta para assinar/verificar os tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_super_segura';

interface TokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido.' }); // Falha...
  }

  // O formato vem como "Bearer <token>", precisa de tratamento
  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id } = decoded as TokenPayload;

    // Injeta o ID do usuário na requisição para o Controller usar
    (req as any).user = { id };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' }); // Falha...
  }
}
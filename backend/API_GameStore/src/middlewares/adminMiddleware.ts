import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // O authMiddleware já colocou o userId no req
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Acesso negado. Faça login.' });
    }

    // Busca o usuário no banco para ver sua role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso proibido. Área restrita para administradores.' }); // Prevenir entrada de não-admins
    }

    // Se for ADMIN, deixa passar
    return next();

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar permissões.' }); // Falha...
  }
};
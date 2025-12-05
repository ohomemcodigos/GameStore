import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { z } from 'zod';

// >> Zod <<
const createOrderSchema = z.object({
  gameIds: z.array(
    z.number()
  ).min(1, "O carrinho não pode estar vazio."),
});

// Função auxiliar para gerar chave
function generateLicenseKey() {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${segment()}-${segment()}-${segment()}`;
}

export const orderController = {
  
  // --- CRIAR PEDIDO ---
  async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; 

      // Validação com o zod
      const validation = createOrderSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({  // Falha...
          error: 'Dados inválidos.',
          details: validation.error.issues.map((err: any) => err.message) 
        });
      }

      const { gameIds } = validation.data;

      // Buscar jogos no banco
      const games = await prisma.game.findMany({
        where: { id: { in: gameIds } }
      });

      if (games.length !== gameIds.length) {
        return res.status(400).json({ error: 'Um ou mais jogos não foram encontrados.' }); // Falha...
      }

      // Calcular o total
      const total = games.reduce((acc: number, game: any) => {
        const price = game.discountPrice ? Number(game.discountPrice) : Number(game.price);
        return acc + price;
      }, 0);

      // Transação
      const result = await prisma.$transaction(async (tx: any) => {
        
        // Fazendo o pedido
        const order = await tx.order.create({
          data: {
            userId,
            total,
            status: 'COMPLETED',
            items: {
              create: games.map((game: any) => ({
                gameId: game.id,
                priceAtPurchase: game.discountPrice || game.price,
                quantity: 1
              }))
            }
          },
          include: { items: true }
        });

        // Registrar pagamento (simulado)
        await tx.transaction.create({
          data: {
            orderId: order.id,
            amount: total,
            status: 'SUCCESS',
            paymentMethod: 'CREDIT_CARD',
            gatewayId: `SIMULATED-${Date.now()}`
          }
        });

        // Gerar chaves de licença
        for (const item of order.items) {
          await tx.licenseKey.create({
            data: {
              keyString: generateLicenseKey(),
              gameId: item.gameId,
              isUsed: true, 
              orderItemId: item.id
            }
          });
        }

        return order;
      });

      return res.status(201).json(result); // Sucesso!

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ error: 'Erro ao processar compra.' }); // Falha...
    }
  },

  // --- MEUS PEDIDOS ---
  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              game: true, 
              licenseKeys: true 
            }
          }
        }
      });

      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos.' }); // Falha...
    }
  },

  async payOrder(req: Request, res: Response) {
     return res.json({ message: "Pagamento já realizado." });
  }
};
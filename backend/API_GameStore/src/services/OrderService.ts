import { prisma } from "../index";
import { Decimal } from '@prisma/client/runtime/library';

// Interfaces simples para entrada de dados
interface CreateOrderInput {
    userId: number;
    gameIds: number[];
}

interface ProcessPaymentInput {
    orderId: number;
    paymentMethod: string;
    cardNumber?: string;
}

export const OrderService = {

    // Criação do Pedido
    async createOrder(data: CreateOrderInput) {
        const { userId, gameIds } = data;

        return await prisma.$transaction(async (tx) => {
            
            // Buscar jogos no banco
            const games = await tx.game.findMany({
                where: { id: { in: gameIds } },
                select: { id: true, price: true, title: true }
            });

            // Verifica se todos foram encontrados
            if (games.length !== gameIds.length) {
                throw new Error("Um ou mais jogos do carrinho não existem.");
            }

            // Calcular Total
            const totalAmount = games.reduce((sum, game) => {
                return sum.add(game.price); // Soma Decimal
            }, new Decimal(0));

            // Criar Pedido
            // Nota: Assumimos quantidade 1 para cada jogo (venda digital)
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total: totalAmount,
                    status: "PENDING",
                    items: {
                        create: games.map(game => ({
                            gameId: game.id,
                            quantity: 1,
                            priceAtPurchase: game.price
                        }))
                    }
                },
                include: { items: true }
            });

            return newOrder;
        });
    },

    // Processamento do Pagamento
    async processPayment(data: ProcessPaymentInput) {
        const { orderId, paymentMethod, cardNumber } = data;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order) throw new Error("Pedido não encontrado.");
        if (order.status !== "PENDING") throw new Error("Pedido já processado.");

        // Simulação de Gateway
        let status = 'SUCCESS';
        let gatewayMsg = "Pagamento aprovado.";

        if (paymentMethod === 'CREDIT_CARD' && cardNumber?.startsWith('4242')) {
            status = 'FAILED';
            gatewayMsg = "Pagamento recusado.";
        }

        return await prisma.$transaction(async (tx) => {
            // Cria Transação
            const transaction = await tx.transaction.create({
                data: {
                    orderId,
                    amount: order.total,
                    status,
                    paymentMethod,
                    gatewayId: `TX-${Date.now()}`
                }
            });

            // Se aprovado, consome as chaves
            if (status === 'SUCCESS') {
                for (const item of order.items) {
                    // Busca 1 chave disponível
                    const key = await tx.licenseKey.findFirst({
                        where: { gameId: item.gameId, isUsed: false }
                    });

                    // Se não tiver chave, falha a transação inteira (segurança de estoque)
                    if (!key) {
                        throw new Error(`Estoque esgotado para o jogo ID ${item.gameId}.`);
                    }

                    // Marca como usada
                    await tx.licenseKey.update({
                        where: { id: key.id },
                        data: { isUsed: true, orderItemId: item.id }
                    });
                }
            }

            // Atualiza Pedido
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { 
                    status: status === 'SUCCESS' ? 'PAID' : 'FAILED',
                    updatedAt: new Date()
                }
            });

            return { transaction, updatedOrder, gatewayMessage: gatewayMsg };
        });
    },

    // Listar Pedidos do Usuário
    async getUserOrders(userId: number) {
        return await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        // Inclui dados do jogo para exibir na lista "Meus Jogos"
                        game: { select: { title: true, coverUrl: true } }
                    }
                },
                transactions: true
            }
        });
    }
};
import { prisma } from "../index";
import { Decimal } from '@prisma/client/runtime/library';

// Define a estrutura esperada para a entrada (o carrinho do usuário)
type ItemInput = { 
    gameId: number; 
    quantity: number; 
};

type CreateOrderInput = {
    userId: number; 
    items: ItemInput[]; 
};

type PaymentInput = {
    orderId: number;
    paymentMethod: 'CREDIT_CARD' | 'PIX' | 'BOLETO';
    cardNumber?: string;
};

export const OrderService = {

async createOrder(data: CreateOrderInput) {
    const { userId, items } = data;

    const newOrder = await prisma.$transaction(async (tx) => {

    // Coletar IDs e verificar a existência dos jogos
    const gameIds = items.map(item => item.gameId);
    const games = await tx.game.findMany({
        where: { id: { in: gameIds } },
        select: { id: true, price: true, title: true }
    });

    if (games.length !== gameIds.length) {
        throw new Error("Um ou mais jogos no carrinho não foram encontrados.");
    }

    // Verificação de Estoque (CHAVES DE LICENÇA)
    for (const item of items) {
        // Contar quantas chaves NÃO USADAS existem para o jogo
        const availableLicenses = await tx.licenseKey.count({
            where: {
                gameId: item.gameId,
                isUsed: false,
            }
        });

        // Compara o estoque disponível com a quantidade desejada
        if (availableLicenses < item.quantity) {
            const gameData = games.find(g => g.id === item.gameId);
            throw new Error(`Estoque insuficiente para o jogo '${gameData?.title || item.gameId}'. Disponível: ${availableLicenses}, Desejado: ${item.quantity}.`);
        }
    }

    // Calcula total e monta o OrderItems
    let total = new Decimal(0);
    const orderItemsData = items.map(item => {
        const gameData = games.find(g => g.id === item.gameId);
        const priceAtPurchase = gameData!.price;

        const subtotalItem = priceAtPurchase.mul(item.quantity);
        total = total.add(subtotalItem);

        return {
            gameId: item.gameId,
            priceAtPurchase: priceAtPurchase,
            quantity: item.quantity,
        };
    });

    // Cria o Pedido (Order) e os Itens do Pedido (OrderItem)
    const newOrder = await prisma.order.create({
        data: {
            userId: userId,
            total: total,
            status: "PENDING",
            items: {
                create: orderItemsData,
            }
        },
        include: {
            items: true // Inclui os itens para a resposta
        }
    });

    return newOrder;
});

    return newOrder;
},
    
async processPayment(data: PaymentInput) {
    const { orderId, paymentMethod, cardNumber } = data;

    // Verificar se o pedido existe e está pendente (com os itens incluídos)
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true } // Deve incluir os itens do pedido para atribuir as keys depois
    });

    if (!order) {
        throw new Error("Pedido não encontrado.");
    }
    if (order.status !== "PENDING") {
        throw new Error(`O pedido já foi processado com status: ${order.status}.`);
    }

    // Simu. do Gateway de Pagamento
    let transactionStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS';
    let gatewayMessage = "Pagamento aprovado pelo gateway simulado.";

    if (cardNumber && cardNumber.startsWith('4242')) {
        transactionStatus = 'FAILED';
        gatewayMessage = "Pagamento rejeitado: Cartão bloqueado/Inválido (Simulação).";
    }

    // Cria a Transação, Atualiza o Pedido E ATRIBUIR AS KEYS
    const newOrderStatus = transactionStatus === 'SUCCESS' ? 'PAID' : 'FAILED';

    const result = await prisma.$transaction(async (tx) => {
        
        // Cria o registro da transação
        const transaction = await tx.transaction.create({
            data: {
                orderId: orderId,
                status: transactionStatus,
                amount: order.total,
                paymentMethod: paymentMethod,
                gatewayId: `SIMULATED-${Date.now()}`,
            },
        });

        // Atribui Keys apenas se o pagamento foi bem-sucedido 
        if (transactionStatus === 'SUCCESS') {
            for (const item of order.items) {
                // Seleciona a quantidade necessária de chaves NÃO USADAS
                const licensesToAssign = await tx.licenseKey.findMany({
                    where: {
                        gameId: item.gameId,
                        isUsed: false,
                    },
                    take: item.quantity, // Limita ao número exato de cópias compradas
                });

                if (licensesToAssign.length !== item.quantity) {
                    // Isso indica um problema grave de concorrência ou falha no createOrder, 
                    // mas é crucial verificar novamente.
                    throw new Error(`Falha crítica de estoque para o item ${item.id}. A transação será revertida.`);
                }

                // Atualiza as chaves: marca como usada e atribui ao OrderItem
                await tx.licenseKey.updateMany({
                    where: {
                        id: { in: licensesToAssign.map(l => l.id) }
                    },
                    data: {
                        isUsed: true,
                        orderItemId: item.id, // Liga a chave ao item do pedido
                    }
                });
            }
        }

        // Atualiza o status do pedido
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { 
                status: newOrderStatus, 
                updatedAt: new Date()
            },
        });

        return { transaction, updatedOrder, gatewayMessage };
    });

    return result;
},
    
    async getUserOrders(userId: number) {
        const orders = await prisma.order.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }, 
            include: {
                items: {
                    include: {
                        game: {
                            select: { title: true, genre: true } 
                        }
                    }
                },
                transactions: true,
            }
        });

        return orders;
    },
};
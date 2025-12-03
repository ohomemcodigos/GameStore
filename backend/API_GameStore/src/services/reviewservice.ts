

import { PrismaClient } from '@prisma/client';
// Assumindo que você inicializa o Prisma Client globalmente

const prisma = new PrismaClient(); 

// --- Tipos de Dados ---
interface CreateReviewInput {
    gameId: number;
    userId: number; // Precisamos saber quem avaliou
    rating: number; // 1 a 5
    comment: string;
}

// --- Funções de Serviço ---

/**
 * Salva uma nova avaliação no banco de dados.
 */
export const ReviewService = {
    async createReview({ gameId, userId, rating, comment }: CreateReviewInput) {
        // Validação básica (poderia ser mais robusta no Controller)
        if (rating < 1 || rating > 5) {
            throw new Error("A avaliação deve ser entre 1 e 5 estrelas.");
        }

        // Usa o método 'create' do Prisma para salvar
        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                game: { connect: { id: gameId } }, // Conecta ao Game pelo ID
                user: { connect: { id: userId } }, // Conecta ao User pelo ID
                createdAt: new Date(),
            },
            select: { // Seleciona apenas os dados que queremos retornar para o Front-end
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: { select: { nickname: true } }
            }
        });

        return {
            ...review,
            userNickname: review.user.nickname,
        };
    },

    /**
     * Busca todas as avaliações para um jogo específico.
     */
    async getReviewsByGameId(gameId: number) {
        return prisma.review.findMany({
            where: {
                gameId: gameId,
            },
            orderBy: {
                createdAt: 'desc', // Mais recentes primeiro
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,
                user: { select: { nickname: true } } // Inclui o nickname do usuário
            }
        });
    }
};
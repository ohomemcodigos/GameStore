import api from './config'; 

interface NewReviewData {
    gameId: number;
    rating: number;
    comment: string;
}

interface CreatedReview {
    id: number;
    rating: number;
    comment: string;
    userNickname: string;
    createdAt: string;
}

export const reviewService = {
    /**
     * Envia uma nova avaliação para o servidor
     * POST /api/reviews/games/:gameId
     */
    async create(data: NewReviewData): Promise<CreatedReview> {
        try {
            const response = await api.post(`/api/reviews/games/${data.gameId}`, {
                rating: data.rating,
                comment: data.comment,
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            throw error;
        }
    },

    /**
     * Busca todas as avaliações de um jogo específico
     * GET /api/reviews/games/:gameId
     */
    async getByGameId(gameId: string): Promise<CreatedReview[]> {
        try {
            const response = await api.get(`/api/reviews/games/${gameId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
            throw error;
        }
    }
};
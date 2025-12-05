import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewservice';
import { createReviewSchema } from '../validators/reviewValidator';
import { ZodError } from 'zod';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string | number;
    }
}

/*
 * Cria uma nova avaliação (POST)
*/
export const createReview = async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    // IDs vindos da URL e do Token não passam pelo Zod do body, 
    // então mantemos a conversão simples aqui.
    const gameId = Number(req.params.gameId);
    const userId = Number(authReq.user?.id);

    try {
        // Validação Manual dos IDs (Segurança básica)
        if (isNaN(gameId) || isNaN(userId)) {
            return res.status(400).json({ message: "ID do jogo ou usuário inválido." });
        }

        // Validação do Body com Zod
        const { rating, comment } = createReviewSchema.parse(req.body);

        console.log('--- REQUISIÇÃO DE REVIEW VALIDADA ---');
        console.log('Game ID:', gameId, 'User ID:', userId);

        // Chamada do Serviço
        const newReview = await ReviewService.createReview({
            gameId,
            userId,
            rating,
            comment: comment.trim(),
        });

        return res.status(201).json(newReview);

    } catch (error) {
        // Tratamento de Erro do Zod
        if (error instanceof ZodError) {
            return res.status(400).json({ 
                message: "Dados de avaliação inválidos.", 
                details: error.issues // Retorna array detalhado do erro
            });
        }

        console.error('Erro ao criar avaliação:', error);
        return res.status(500).json({ message: "Erro interno do servidor ao salvar avaliação." });
    }
};

/*
 * Lista as avaliações de um jogo (GET)
 */
export const getReviews = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);

    if (isNaN(gameId)) {
        return res.status(400).json({ message: "ID do jogo inválido." });
    }

    try {
        const reviews = await ReviewService.getReviewsByGameId(gameId);
        return res.status(200).json(reviews);

    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};
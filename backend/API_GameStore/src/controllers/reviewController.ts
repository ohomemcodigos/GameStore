// src/controllers/ReviewController.ts

import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewservice';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string | number;
    }
}

/**
 * Cria uma nova avaliação (POST /api/reviews/games/:gameId)
 */
export const createReview = async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    const gameId = Number(req.params.gameId);
    const userId = Number(authReq.user?.id);
    const { rating, comment } = req.body;

    // Validação de presença
    if (!rating || !comment || isNaN(gameId) || isNaN(userId)) {
        return res.status(400).json({ message: "Dados de avaliação incompletos." });
    }

    // Validação de rating (1-5)
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating deve estar entre 1 e 5." });
    }

    // Validação de comentário
    if (typeof comment !== 'string' || comment.trim().length === 0) {
        return res.status(400).json({ message: "Comentário inválido." });
    }

    try {
        console.log('--- REQUISIÇÃO DE REVIEW RECEBIDA ---');
        console.log('Game ID:', gameId);
        console.log('User ID:', userId);
        console.log('Rating:', rating, 'Comment:', comment);

        const newReview = await ReviewService.createReview({
            gameId,
            userId,
            rating,
            comment: comment.trim(),
        });

        return res.status(201).json(newReview);

    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        return res.status(500).json({ message: "Erro interno do servidor ao salvar avaliação." });
    }
};

/**
 * Lista as avaliações de um jogo (GET /api/reviews/games/:gameId)
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

// src/routes/reviewRoutes.ts

import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint: GET /api/reviews/games/:gameId
router.get('/games/:gameId', getReviews);

// Endpoint: POST /api/reviews/games/:gameId
// Esta rota deve estar protegida por um middleware de autenticação
router.post('/games/:gameId', authMiddleware, createReview);

export default router;